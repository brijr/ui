"use client"

import * as React from "react"
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import { cn } from "cn"

function Menubar({ className, ...props }: MenubarPrimitive.Props) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cn(
        "flex h-9 items-center gap-1 rounded-lg border bg-background p-1 shadow-xs",
        className
      )}
      {...props}
    />
  )
}

function MenubarMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="menubar-menu" {...props} />
}

function MenubarGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="menubar-group" {...props} />
}

function MenubarTrigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex items-center rounded-md px-2 py-1 text-sm font-medium outline-none select-none data-[popup-open]:bg-accent data-[popup-open]:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = "start",
  sideOffset = 6,
  ...props
}: MenuPrimitive.Popup.Props & {
  align?: MenuPrimitive.Positioner.Props["align"]
  sideOffset?: MenuPrimitive.Positioner.Props["sideOffset"]
}) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="z-50"
        align={align}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="menubar-content"
          className={cn(
            "min-w-48 origin-(--transform-origin) overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-md outline-none transition-[transform,opacity] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenuPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:data-highlighted:bg-destructive/10 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  className,
  children,
  ...props
}: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className="size-4" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function MenubarRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  )
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenuPrimitive.RadioItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

function MenubarSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function MenubarSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center rounded-md px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[popup-open]:bg-accent data-[popup-open]:text-accent-foreground data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function MenubarSubContent({
  className,
  ...props
}: MenuPrimitive.Popup.Props) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner className="z-50" sideOffset={4}>
        <MenuPrimitive.Popup
          data-slot="menubar-sub-content"
          className={cn(
            "min-w-32 origin-(--transform-origin) overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-md outline-none transition-[transform,opacity] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}

function MenubarPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="menubar-portal" {...props} />
}
