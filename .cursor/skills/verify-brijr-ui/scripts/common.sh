#!/usr/bin/env bash
# Shared helpers for verify-brijr-ui.
# shellcheck disable=SC2034

verify_init_paths() {
  VERIFY_RUN_ID="${VERIFY_RUN_ID:-$(date +%Y%m%d-%H%M%S)}"
  VERIFY_ROOT="${VERIFY_ROOT:-/tmp/brijr-ui-verify/$VERIFY_RUN_ID}"
  VERIFY_ARTIFACTS="${VERIFY_ARTIFACTS:-$VERIFY_ROOT/artifacts}"
  VERIFY_STATE_FILE="${VERIFY_STATE_FILE:-$VERIFY_ROOT/state.env}"
  VERIFY_LOG_FILE="${VERIFY_LOG_FILE:-$VERIFY_ROOT/server.log}"
  VERIFY_TOOLS_DIR="${VERIFY_TOOLS_DIR:-$VERIFY_ROOT/tools}"
  mkdir -p "$VERIFY_ROOT" "$VERIFY_ARTIFACTS"
}

ensure_state_loaded() {
  verify_init_paths
  if [[ ! -f "$VERIFY_STATE_FILE" ]]; then
    echo "Missing state file: $VERIFY_STATE_FILE (run launch first)" >&2
    exit 1
  fi
  # shellcheck disable=SC1090
  source "$VERIFY_STATE_FILE"
  if [[ -z "${VERIFY_URL:-}" || -z "${VERIFY_PORT:-}" ]]; then
    echo "state.env incomplete; re-run launch" >&2
    exit 1
  fi
  export VERIFY_URL VERIFY_PORT VERIFY_PID VERIFY_ARTIFACTS VERIFY_ROOT VERIFY_TOOLS_DIR
}

pick_free_port() {
  if [[ -n "${VERIFY_PORT:-}" ]]; then
    echo "$VERIFY_PORT"
    return
  fi
  node -e 'const n=require("net");const s=n.createServer();s.listen(0,"127.0.0.1",()=>{console.log(s.address().port);s.close()});'
}

wait_http_ok() {
  local url="$1"
  local i
  for i in $(seq 1 60); do
    if curl -sf "$url" >/dev/null; then
      return 0
    fi
    sleep 0.5
  done
  echo "Timed out waiting for $url" >&2
  return 1
}

verify_launch() {
  verify_init_paths
  cd "$ROOT_DIR"

  if [[ ! -d node_modules ]]; then
    echo "Installing npm dependencies…"
    npm install
  fi

  if [[ "${VERIFY_REBUILD:-0}" == "1" || ! -d .next ]]; then
    echo "Building production app…"
    npm run build
  fi

  local port
  port="$(pick_free_port)"
  export PORT="$port"

  echo "Starting next start on port $port…"
  nohup npm run start >"$VERIFY_LOG_FILE" 2>&1 &
  local pid=$!

  local url="http://127.0.0.1:${port}"
  if ! wait_http_ok "$url/"; then
    kill "$pid" 2>/dev/null || true
    echo "Server failed to become ready. Log: $VERIFY_LOG_FILE" >&2
    tail -n 80 "$VERIFY_LOG_FILE" >&2 || true
    exit 1
  fi

  cat >"$VERIFY_STATE_FILE" <<EOF
VERIFY_RUN_ID=$VERIFY_RUN_ID
VERIFY_ROOT=$VERIFY_ROOT
VERIFY_ARTIFACTS=$VERIFY_ARTIFACTS
VERIFY_TOOLS_DIR=$VERIFY_TOOLS_DIR
VERIFY_PORT=$port
VERIFY_URL=$url
VERIFY_PID=$pid
VERIFY_LOG_FILE=$VERIFY_LOG_FILE
EOF

  export VERIFY_URL="$url" VERIFY_PORT="$port" VERIFY_PID="$pid"
  echo "Launched $url (pid $pid)"
  echo "State: $VERIFY_STATE_FILE"
  echo "Artifacts: $VERIFY_ARTIFACTS"
}

verify_doctor() {
  ensure_state_loaded

  if ! kill -0 "$VERIFY_PID" 2>/dev/null; then
    echo "FAIL: VERIFY_PID $VERIFY_PID is not running" >&2
    exit 1
  fi

  if ! ss -ltnp 2>/dev/null | grep -q ":$VERIFY_PORT " && ! curl -sf "$VERIFY_URL/" >/dev/null; then
    echo "FAIL: nothing answering on $VERIFY_URL" >&2
    exit 1
  fi

  local home
  home="$(curl -sf "$VERIFY_URL/")"
  if ! grep -q 'brijr/ui' <<<"$home"; then
    echo "FAIL: home page does not identify brijr/ui" >&2
    exit 1
  fi

  local registry
  registry="$(curl -sf "$VERIFY_URL/r/registry.json")"
  if ! grep -q '"name":"brijr"' <<<"$registry"; then
    echo "FAIL: /r/registry.json missing name brijr" >&2
    exit 1
  fi

  echo "Checking client interactivity (theme toggle)…"
  VERIFY_DOCTOR_PROBE=1 node "$SCRIPT_DIR/browser.mjs" doctor-theme

  echo "OK: $VERIFY_URL (pid $VERIFY_PID) is healthy for driving"
}

verify_cleanup() {
  verify_init_paths
  if [[ ! -f "$VERIFY_STATE_FILE" ]]; then
    echo "No state file at $VERIFY_STATE_FILE; nothing to stop"
    return 0
  fi
  # shellcheck disable=SC1090
  source "$VERIFY_STATE_FILE"
  export VERIFY_URL VERIFY_PORT VERIFY_PID VERIFY_ARTIFACTS VERIFY_ROOT VERIFY_TOOLS_DIR
  if [[ -n "${VERIFY_ROOT:-}" ]]; then
    node "$SCRIPT_DIR/browser.mjs" stop >/dev/null 2>&1 || true
  fi
  if [[ -n "${VERIFY_PID:-}" ]] && kill -0 "$VERIFY_PID" 2>/dev/null; then
    kill "$VERIFY_PID"
    local i
    for i in $(seq 1 20); do
      if ! kill -0 "$VERIFY_PID" 2>/dev/null; then
        break
      fi
      sleep 0.25
    done
    if kill -0 "$VERIFY_PID" 2>/dev/null; then
      kill -9 "$VERIFY_PID" 2>/dev/null || true
    fi
    echo "Stopped pid $VERIFY_PID"
  else
    echo "PID ${VERIFY_PID:-unknown} already stopped"
  fi
  echo "Artifacts retained at ${VERIFY_ARTIFACTS:-$VERIFY_ROOT/artifacts}"
}

verify_http() {
  local sub="${1:-}"
  shift || true
  if [[ "$sub" != "get" ]]; then
    echo "Usage: verify-brijr-ui http get <path> [--path file] [--expect-status N]" >&2
    exit 2
  fi
  local path="${1:-}"
  shift || true
  if [[ -z "$path" ]]; then
    echo "http get requires a path like /r/registry.json" >&2
    exit 2
  fi
  local out=""
  local expect=200
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --path)
        out="$2"
        shift 2
        ;;
      --expect-status)
        expect="$2"
        shift 2
        ;;
      *)
        echo "Unknown http arg: $1" >&2
        exit 2
        ;;
    esac
  done
  if [[ -z "$out" ]]; then
    out="$VERIFY_ARTIFACTS/http$(echo "$path" | tr '/' '_')"
  fi
  mkdir -p "$(dirname "$out")"
  local status
  status="$(curl -sS -o "$out" -w "%{http_code}" "$VERIFY_URL$path")"
  if [[ "$status" != "$expect" ]]; then
    echo "FAIL: GET $path returned $status (expected $expect). Body: $out" >&2
    exit 1
  fi
  echo "GET $path -> $status ($out)"
}
