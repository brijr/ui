import { loadRegistry } from "shadcn/registry"

import {
  LabFrame,
  LabHeader,
  LabInstall,
  StyleLab,
} from "@/components/style-lab"

export default async function Page() {
  const registry = await loadRegistry()
  const items = (registry.items ?? []).map((item) => ({
    name: item.name,
    title: item.title,
  }))

  return (
    <LabFrame>
      <LabHeader />
      <StyleLab />
      <LabInstall items={items} />
    </LabFrame>
  )
}
