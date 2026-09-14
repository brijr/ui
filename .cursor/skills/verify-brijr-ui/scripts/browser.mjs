#!/usr/bin/env node
/**
 * Playwright/CDP driver for verify-brijr-ui.
 * Keeps a persistent Chromium (remote debugging) so chained commands share page state.
 * Installs playwright into $VERIFY_TOOLS_DIR on first use (not into the app package.json).
 */
import { spawn, spawnSync } from "node:child_process"
import { createRequire } from "node:module"
import fs from "node:fs"
import net from "node:net"
import path from "node:path"
import { setTimeout as delay } from "node:timers/promises"

const toolsDir = process.env.VERIFY_TOOLS_DIR
const verifyUrl = process.env.VERIFY_URL
const artifacts = process.env.VERIFY_ARTIFACTS || "."
const root = process.env.VERIFY_ROOT

if (!toolsDir || !verifyUrl || !root) {
  console.error("VERIFY_TOOLS_DIR, VERIFY_URL, and VERIFY_ROOT are required")
  process.exit(1)
}

const browserStatePath = path.join(root, "browser.json")

function ensurePlaywrightModule() {
  const pkgJson = path.join(toolsDir, "package.json")
  fs.mkdirSync(toolsDir, { recursive: true })
  if (!fs.existsSync(pkgJson)) {
    fs.writeFileSync(
      pkgJson,
      JSON.stringify({ name: "brijr-ui-verify-tools", private: true, type: "commonjs" }, null, 2)
    )
  }
  const requireFromTools = createRequire(pkgJson)
  try {
    return requireFromTools("playwright")
  } catch {
    console.error("Installing playwright into", toolsDir)
    const r = spawnSync("npm", ["install", "playwright@1.63.0", "--no-save"], {
      cwd: toolsDir,
      stdio: "inherit",
    })
    if (r.status !== 0) process.exit(r.status ?? 1)
    return requireFromTools("playwright")
  }
}

function chromePath() {
  for (const candidate of [
    process.env.VERIFY_CHROME_PATH,
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/local/bin/google-chrome",
  ]) {
    if (candidate && fs.existsSync(candidate)) return candidate
  }
  throw new Error("Google Chrome not found; set VERIFY_CHROME_PATH")
}

function freePort() {
  return new Promise((resolve, reject) => {
    const s = net.createServer()
    s.listen(0, "127.0.0.1", () => {
      const addr = s.address()
      const port = typeof addr === "object" && addr ? addr.port : 0
      s.close((err) => (err ? reject(err) : resolve(port)))
    })
    s.on("error", reject)
  })
}

function parseArgs(argv) {
  const out = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--")) {
      const key = a.slice(2)
      const next = argv[i + 1]
      if (!next || next.startsWith("--")) {
        out[key] = true
      } else {
        out[key] = next
        i++
      }
    } else {
      out._.push(a)
    }
  }
  return out
}

function readBrowserState() {
  if (!fs.existsSync(browserStatePath)) return null
  try {
    return JSON.parse(fs.readFileSync(browserStatePath, "utf8"))
  } catch {
    return null
  }
}

function writeBrowserState(state) {
  fs.writeFileSync(browserStatePath, JSON.stringify(state, null, 2))
}

async function waitCdp(port, attempts = 40) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`)
      if (res.ok) return await res.json()
    } catch {
      /* retry */
    }
    await delay(250)
  }
  throw new Error(`CDP not ready on port ${port}`)
}

async function startBrowser() {
  const existing = readBrowserState()
  if (existing?.pid && existing?.cdpPort) {
    try {
      process.kill(existing.pid, 0)
      await waitCdp(existing.cdpPort, 4)
      console.log(`browser already running (pid ${existing.pid}, cdp ${existing.cdpPort})`)
      return existing
    } catch {
      /* restart */
    }
  }

  const cdpPort = await freePort()
  const userDataDir = path.join(root, "chrome-profile")
  fs.mkdirSync(userDataDir, { recursive: true })
  const logFile = path.join(root, "chrome.log")
  const logFd = fs.openSync(logFile, "w")
  const child = spawn(
    chromePath(),
    [
      `--remote-debugging-port=${cdpPort}`,
      `--user-data-dir=${userDataDir}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "about:blank",
    ],
    { stdio: ["ignore", logFd, logFd], detached: true }
  )
  child.unref()
  fs.closeSync(logFd)

  await waitCdp(cdpPort)
  const state = { pid: child.pid, cdpPort, userDataDir }
  writeBrowserState(state)
  console.log(`browser started pid=${child.pid} cdp=${cdpPort}`)
  return state
}

async function stopBrowser() {
  const state = readBrowserState()
  if (!state?.pid) {
    console.log("no browser session")
    return
  }
  try {
    process.kill(state.pid, "SIGTERM")
  } catch {
    /* already gone */
  }
  await delay(300)
  try {
    process.kill(state.pid, 0)
    process.kill(state.pid, "SIGKILL")
  } catch {
    /* gone */
  }
  if (fs.existsSync(browserStatePath)) fs.unlinkSync(browserStatePath)
  console.log(`browser stopped pid=${state.pid}`)
}

async function connectPage() {
  let state = readBrowserState()
  if (!state?.cdpPort) {
    state = await startBrowser()
  }
  const { chromium } = ensurePlaywrightModule()
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${state.cdpPort}`)
  const context = browser.contexts()[0] || (await browser.newContext({ viewport: { width: 1280, height: 900 } }))
  let page = context.pages().find((p) => p.url().includes("127.0.0.1") || p.url().includes("localhost"))
  if (!page) {
    page = context.pages()[0] || (await context.newPage())
  }
  await page.setViewportSize({ width: 1280, height: 900 })
  return { browser, page, state }
}

function locatorFrom(page, args) {
  const role = args.role
  const name = args.name
  if (!role) throw new Error("--role is required")
  if (name) return page.getByRole(role, { name: String(name) })
  return page.getByRole(role)
}

async function doctorTheme(page) {
  const home = verifyUrl.replace(/\/$/, "") + "/"
  await page.goto(home, { waitUntil: "networkidle" })
  await page.waitForTimeout(300)
  const before = await page.evaluate(() => document.documentElement.classList.contains("dark"))
  if (before) {
    await page.getByRole("button", { name: "Toggle dark mode" }).click()
    await page.waitForTimeout(200)
  }
  await page.getByRole("button", { name: "Toggle dark mode" }).click()
  await page.waitForTimeout(300)
  const dark = await page.evaluate(() => document.documentElement.classList.contains("dark"))
  if (!dark) throw new Error("Theme toggle did not add class dark — client interactivity failed")
  await page.getByRole("button", { name: "Toggle dark mode" }).click()
  await page.waitForTimeout(200)
  const light = await page.evaluate(() => !document.documentElement.classList.contains("dark"))
  if (!light) throw new Error("Theme toggle did not return to light")
  console.log("theme interactivity ok")
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const cmd = args._[0]
  if (!cmd) {
    console.error(
      "Usage: browser <start|stop|goto|click|fill|press|snapshot|screenshot|eval|doctor-theme> [flags]"
    )
    process.exit(2)
  }

  if (cmd === "start") {
    await startBrowser()
    return
  }
  if (cmd === "stop") {
    await stopBrowser()
    return
  }

  const { browser, page } = await connectPage()
  try {
    switch (cmd) {
      case "doctor-theme":
        await doctorTheme(page)
        break
      case "goto": {
        const p = args.path || args.url || "/"
        const url = String(p).startsWith("http")
          ? String(p)
          : verifyUrl.replace(/\/$/, "") + (String(p).startsWith("/") ? p : `/${p}`)
        await page.goto(url, { waitUntil: "networkidle" })
        console.log(page.url())
        break
      }
      case "click": {
        await locatorFrom(page, args).click()
        console.log("clicked", args.role, args.name || "")
        break
      }
      case "fill": {
        if (args.value === undefined) throw new Error("--value is required")
        await locatorFrom(page, args).fill(String(args.value))
        console.log("filled", args.name || args.role, "=>", args.value)
        break
      }
      case "press": {
        if (!args.key) throw new Error("--key is required")
        await page.locator("body").click({ position: { x: 5, y: 5 } })
        await page.keyboard.press(String(args.key))
        console.log("pressed", args.key)
        break
      }
      case "snapshot": {
        const out = args.path || path.join(artifacts, "snapshot.aria.yml")
        fs.mkdirSync(path.dirname(out), { recursive: true })
        const snap = await page.locator("body").ariaSnapshot()
        fs.writeFileSync(out, snap)
        console.log("wrote", out)
        break
      }
      case "screenshot": {
        const out = args.path || path.join(artifacts, "screenshot.png")
        fs.mkdirSync(path.dirname(out), { recursive: true })
        await page.screenshot({ path: out, fullPage: Boolean(args["full-page"]) })
        console.log("wrote", out)
        break
      }
      case "eval": {
        const expr = args.expr
        if (!expr) throw new Error("--expr is required")
        const result = await page.evaluate((e) => eval(e), expr)
        console.log(typeof result === "string" ? result : JSON.stringify(result))
        break
      }
      default: {
        const _exhaustive = cmd
        throw new Error(`Unknown browser command: ${_exhaustive}`)
      }
    }
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
