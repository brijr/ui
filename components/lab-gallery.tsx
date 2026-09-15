"use client"

import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ChevronDownIcon,
} from "lucide-react"

import { LabSection } from "./style-lab"
import s from "./style-lab.module.css"
import { cn } from "@/lib/utils"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { buttonVariants } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  InputOTP,
  InputOTPInput,
  InputOTPSeparator,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const invoices = [
  { id: "INV-001", status: "Paid", total: "$250.00" },
  { id: "INV-002", status: "Pending", total: "$150.00" },
  { id: "INV-003", status: "Unpaid", total: "$350.00" },
]

export function LabGallery() {
  return (
    <>
      <LabSection title="Toggle">
        <div className={cn(s.spanAll, "flex flex-wrap items-center gap-4")}>
          <Toggle aria-label="Toggle bold">
            <BoldIcon />
          </Toggle>
          <Toggle variant="outline" aria-label="Toggle italic">
            <ItalicIcon />
            Italic
          </Toggle>
          <ToggleGroup defaultValue={["bold"]} variant="outline">
            <ToggleGroupItem value="bold" aria-label="Bold">
              <BoldIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <ItalicIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <UnderlineIcon />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </LabSection>

      <LabSection title="Tabs">
        <div className={s.spanAll}>
          <Tabs defaultValue="overview" className="max-w-md">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-3 text-sm">
              Workspace stats and recent activity.
            </TabsContent>
            <TabsContent value="activity" className="pt-3 text-sm">
              A log of everything that happened.
            </TabsContent>
            <TabsContent value="settings" className="pt-3 text-sm">
              Profile and preferences.
            </TabsContent>
          </Tabs>
        </div>
      </LabSection>

      <LabSection title="Accordion">
        <div className={cn(s.spanAll, "max-w-lg")}>
          <Accordion defaultValue={["item-1"]}>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It ships with the correct ARIA roles out of the box.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled here?</AccordionTrigger>
              <AccordionContent>
                Only the layout. Restyle it and ship through the registry.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </LabSection>

      <LabSection title="Select & Radio">
        <div className={cn(s.spanAll, "flex flex-wrap items-start gap-8")}>
          <Select defaultValue="next">
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="next">Next.js</SelectItem>
              <SelectItem value="remix">Remix</SelectItem>
              <SelectItem value="astro">Astro</SelectItem>
              <SelectItem value="vite">Vite</SelectItem>
            </SelectContent>
          </Select>
          <RadioGroup defaultValue="comfortable" className="gap-2">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="default" id="r-default" />
              <Label htmlFor="r-default">Default</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="comfortable" id="r-comfortable" />
              <Label htmlFor="r-comfortable">Comfortable</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="compact" id="r-compact" />
              <Label htmlFor="r-compact">Compact</Label>
            </div>
          </RadioGroup>
        </div>
      </LabSection>

      <LabSection title="Slider & Progress">
        <div className={cn(s.spanAll, "flex max-w-md flex-col gap-6")}>
          <Slider defaultValue={40} />
          <Progress value={66} />
        </div>
      </LabSection>

      <LabSection title="Avatar & Skeleton">
        <div className={cn(s.spanAll, "flex items-center gap-6")}>
          <Avatar>
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      </LabSection>

      <LabSection title="Alert">
        <div className={cn(s.spanAll, "flex max-w-xl flex-col gap-3")}>
          <Alert>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>
              You can add components to your app using the registry.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>Your session has expired.</AlertDescription>
          </Alert>
        </div>
      </LabSection>

      <LabSection title="Overlays">
        <div className={cn(s.spanAll, "flex flex-wrap items-center gap-3")}>
          <Tooltip>
            <TooltipTrigger className={buttonVariants({ variant: "outline" })}>
              Tooltip
            </TooltipTrigger>
            <TooltipContent>Supplementary detail</TooltipContent>
          </Tooltip>

          <Popover>
            <PopoverTrigger className={buttonVariants({ variant: "outline" })}>
              Popover
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-sm font-medium">Dimensions</p>
              <p className="text-sm text-muted-foreground">
                Set the layout dimensions here.
              </p>
            </PopoverContent>
          </Popover>

          <HoverCard>
            <HoverCardTrigger
              className={buttonVariants({ variant: "outline" })}
            >
              Hover card
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-sm">Previews appear on hover.</p>
            </HoverCardContent>
          </HoverCard>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({ variant: "outline" })}
            >
              Menu <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </LabSection>

      <LabSection title="Dialog, Alert & Sheet">
        <div className={cn(s.spanAll, "flex flex-wrap items-center gap-3")}>
          <Dialog>
            <DialogTrigger className={buttonVariants({ variant: "outline" })}>
              Open dialog
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose className={buttonVariants({ variant: "ghost" })}>
                  Cancel
                </DialogClose>
                <DialogClose className={buttonVariants()}>Save</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger
              className={buttonVariants({ variant: "outline" })}
            >
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Sheet>
            <SheetTrigger className={buttonVariants({ variant: "outline" })}>
              Open sheet
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Panel</SheetTitle>
                <SheetDescription>
                  A dialog that slides in from the edge.
                </SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <SheetClose className={buttonVariants({ variant: "outline" })}>
                  Close
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </LabSection>

      <LabSection title="Context menu & Collapsible">
        <div className={cn(s.spanAll, "flex flex-wrap items-start gap-6")}>
          <ContextMenu>
            <ContextMenuTrigger className="flex h-20 w-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              Right click here
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Back</ContextMenuItem>
              <ContextMenuItem>Forward</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Reload</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>

          <Collapsible className="w-64">
            <CollapsibleTrigger
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Toggle details
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-2 text-sm text-muted-foreground">
                Hidden content that expands and collapses.
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </LabSection>

      <LabSection title="Navigation & Menubar">
        <div className={cn(s.spanAll, "flex flex-wrap items-start gap-6")}>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-64 gap-1">
                    <NavigationMenuLink>Analytics</NavigationMenuLink>
                    <NavigationMenuLink>Engagement</NavigationMenuLink>
                    <NavigationMenuLink>Automation</NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>New Window</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Print</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Undo</MenubarItem>
                <MenubarItem>Redo</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </LabSection>

      <LabSection title="Breadcrumb & Pagination">
        <div className={cn(s.spanAll, "flex flex-col gap-6")}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </LabSection>

      <LabSection title="Table">
        <div className={cn(s.spanAll, "max-w-xl")}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{invoice.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{invoice.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </LabSection>

      <LabSection title="OTP, Scroll area & Ratio">
        <div className={cn(s.spanAll, "flex flex-wrap items-start gap-8")}>
          <InputOTP length={6}>
            <InputOTPInput />
            <InputOTPInput />
            <InputOTPInput />
            <InputOTPSeparator />
            <InputOTPInput />
            <InputOTPInput />
            <InputOTPInput />
          </InputOTP>

          <ScrollArea className="h-28 w-48 rounded-lg border p-3">
            <div className="flex flex-col gap-2 text-sm">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i}>Row {i + 1}</div>
              ))}
            </div>
          </ScrollArea>

          <div className="w-40">
            <AspectRatio
              ratio={16 / 9}
              className="flex items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground"
            >
              16 / 9
            </AspectRatio>
          </div>
        </div>
      </LabSection>
    </>
  )
}
