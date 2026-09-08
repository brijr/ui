import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

import s from "./style-lab.module.css"

const surfaces = [
  ["background", "bg-background"],
  ["card", "bg-card"],
  ["popover", "bg-popover"],
  ["muted", "bg-muted"],
  ["secondary", "bg-secondary"],
  ["accent", "bg-accent"],
] as const

const ink = [
  ["foreground", "bg-foreground"],
  ["muted-foreground", "bg-muted-foreground"],
  ["primary", "bg-primary"],
  ["primary-foreground", "bg-primary-foreground"],
  ["destructive", "bg-destructive"],
] as const

const chrome = [
  ["border", "bg-border"],
  ["input", "bg-input"],
  ["ring", "bg-ring"],
] as const

const radii = [
  ["sm", "rounded-sm"],
  ["md", "rounded-md"],
  ["lg", "rounded-lg"],
  ["xl", "rounded-xl"],
] as const

const buttonVariants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const

const buttonSizes = ["xs", "sm", "default", "lg"] as const

const badgeVariants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
] as const

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "size-8 shrink-0 rounded-md border border-border",
          className
        )}
      />
      <code className="font-mono text-xs text-muted-foreground">{name}</code>
    </div>
  )
}

function LabSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className={s.section}>
      <h2 className={cn(s.label, "text-sm font-medium")}>{title}</h2>
      <div className={s.body}>{children}</div>
    </section>
  )
}

export function LabFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.page}>
      <div className={s.guides} aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index} />
        ))}
      </div>
      {children}
    </div>
  )
}

export function LabHeader() {
  return (
    <header className={s.header}>
      <p className={cn(s.label, "text-sm font-medium")}>Lab</p>
      <div className={s.body}>
        <div className={cn(s.lead, "flex flex-col gap-2")}>
          <h1 className="text-lg font-medium tracking-tight">brijr/ui</h1>
          <p className="text-sm text-pretty text-muted-foreground">
            Style lab. Tokens live in{" "}
            <code className="font-mono text-xs">app/globals.css</code>.
            Components live in{" "}
            <code className="font-mono text-xs">components/ui</code>. We restyle
            here, then ship through the registry.
          </p>
        </div>
        <div className={s.toggle}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export function LabInstall({
  items,
}: {
  items: { name: string; title?: string }[]
}) {
  return (
    <LabSection title="Install">
      <pre className={cn(s.spanAll, "overflow-x-auto font-mono text-xs")}>
        npx shadcn@latest add brijr/ui/button
      </pre>
      {items.map((item) => (
        <div key={item.name} className={cn(s.span3, "text-sm")}>
          <a
            className="underline-offset-4 hover:underline"
            href={`/r/${item.name}.json`}
          >
            {item.name}
          </a>
          {item.title ? (
            <span className="text-muted-foreground"> — {item.title}</span>
          ) : null}
        </div>
      ))}
    </LabSection>
  )
}

export function StyleLab() {
  return (
    <>
      <LabSection title="Color">
        <p
          className={cn(s.spanAll, "text-sm text-pretty text-muted-foreground")}
        >
          Semantic tokens from{" "}
          <code className="font-mono text-xs">app/globals.css</code>. Change the
          variables; these swatches follow.
        </p>
        <div className={cn(s.span3, "flex flex-col gap-3")}>
          {surfaces.map(([name, className]) => (
            <Swatch key={name} name={name} className={className} />
          ))}
        </div>
        <div className={cn(s.span3, "flex flex-col gap-3")}>
          {ink.map(([name, className]) => (
            <Swatch key={name} name={name} className={className} />
          ))}
        </div>
        <div className={cn(s.span3, "flex flex-col gap-3")}>
          {chrome.map(([name, className]) => (
            <Swatch key={name} name={name} className={className} />
          ))}
        </div>
      </LabSection>

      <LabSection title="Type">
        <p className={cn(s.spanAll, "text-lg font-medium tracking-tight")}>
          Statement size for the page title only.
        </p>
        <p className={cn(s.spanAll, "text-sm text-pretty")}>
          Body does the rest. Hierarchy comes from space, then color, then
          weight — size last.
        </p>
        <p
          className={cn(s.spanAll, "text-sm text-pretty text-muted-foreground")}
        >
          Muted is for helper text, metadata, and secondary copy. Same size as
          body.
        </p>
        <p className={cn(s.spanAll, "font-mono text-xs text-muted-foreground")}>
          Geist Mono for code, ids, and commands.
        </p>
      </LabSection>

      <LabSection title="Radius">
        {radii.map(([name, className]) => (
          <div key={name} className={cn(s.span2, "flex flex-col gap-2")}>
            <div
              className={cn("size-12 border border-border bg-muted", className)}
            />
            <code className="font-mono text-xs text-muted-foreground">
              {name}
            </code>
          </div>
        ))}
      </LabSection>

      <LabSection title="Button">
        <div className={cn(s.spanAll, "flex flex-wrap items-center gap-2")}>
          {buttonVariants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
        <div className={cn(s.spanAll, "flex flex-wrap items-center gap-2")}>
          {buttonSizes.map((size) => (
            <Button key={size} size={size}>
              {size}
            </Button>
          ))}
          <Button size="icon" aria-label="Icon button">
            +
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </LabSection>

      <LabSection title="Badge">
        <div className={cn(s.spanAll, "flex flex-wrap items-center gap-2")}>
          {badgeVariants.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
      </LabSection>

      <LabSection title="Form">
        <div className={cn(s.spanAll, "flex flex-col gap-1.5")}>
          <Label htmlFor="lab-name">Display name</Label>
          <Input id="lab-name" defaultValue="Ada Lovelace" />
        </div>
        <div className={cn(s.spanAll, "flex flex-col gap-1.5")}>
          <Label htmlFor="lab-email">Email</Label>
          <Input
            id="lab-email"
            type="email"
            defaultValue="not-an-email"
            aria-invalid
          />
          <p className="text-xs text-muted-foreground">
            Invalid state via <code className="font-mono">aria-invalid</code>.
          </p>
        </div>
        <div className={cn(s.spanAll, "flex flex-col gap-1.5")}>
          <Label htmlFor="lab-notes">Notes</Label>
          <Textarea id="lab-notes" defaultValue="A short note." />
        </div>
        <div className={cn(s.spanAll, "flex flex-col gap-1.5")}>
          <Label htmlFor="lab-disabled">Disabled</Label>
          <Input id="lab-disabled" defaultValue="Can't edit this" disabled />
        </div>
        <div className={cn(s.spanAll, "flex items-center gap-2")}>
          <Checkbox id="lab-alerts" defaultChecked />
          <Label htmlFor="lab-alerts">Email me about product updates</Label>
        </div>
        <div className={cn(s.spanAll, "flex items-center gap-2")}>
          <Switch id="lab-preview" defaultChecked />
          <Label htmlFor="lab-preview">Preview unpublished changes</Label>
        </div>
      </LabSection>

      <LabSection title="Card">
        <div className={s.spanAll}>
          <Card>
            <CardHeader>
              <CardTitle>Workspace</CardTitle>
              <CardDescription>
                A contained, repeatable surface — not a default wrapper.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-pretty">
                Use a card when the block is discrete. Otherwise let spacing do
                the grouping.
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button size="sm">Save</Button>
              <Button size="sm" variant="ghost">
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
      </LabSection>
    </>
  )
}
