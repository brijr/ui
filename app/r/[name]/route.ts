import {
  loadRegistry,
  loadRegistryItem,
  RegistryItemNotFoundError,
} from "shadcn/registry"

export const runtime = "nodejs"

function itemNameFromParam(name: string) {
  return name.endsWith(".json") ? name.slice(0, -5) : name
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ name: string }> }
) {
  const { name } = await context.params
  const itemName = itemNameFromParam(name)

  if (itemName === "registry") {
    try {
      const registry = await loadRegistry()
      return Response.json(registry)
    } catch (error) {
      console.error(error)
      return Response.json(
        { error: "Failed to load registry." },
        { status: 500 }
      )
    }
  }

  try {
    const item = await loadRegistryItem(itemName)
    return Response.json(item)
  } catch (error) {
    if (error instanceof RegistryItemNotFoundError) {
      return Response.json(
        { error: `Registry item "${itemName}" was not found.` },
        { status: 404 }
      )
    }

    console.error(error)
    return Response.json(
      { error: "Failed to load registry item." },
      { status: 500 }
    )
  }
}
