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
      // Dynamic ratio prop requires an inline style; theme styling stays in className.
      // eslint-disable-next-line shadcn/no-inline-styles -- API: ratio → aspectRatio
      style={{ aspectRatio: ratio, ...style }}
      className={cn("relative w-full", className)}
      {...props}
    />
  )
}

export { AspectRatio }
