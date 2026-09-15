import * as React from "react"
import { cn } from "cn"

function AspectRatio({
  className,
  ratio = 1,
  style,
  ...props
}: React.ComponentProps<"div"> & { ratio?: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      style={{ aspectRatio: ratio, ...style }}
      className={cn("relative w-full", className)}
      {...props}
    />
  )
}

export { AspectRatio }
