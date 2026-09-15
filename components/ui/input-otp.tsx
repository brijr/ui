"use client"

import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field"
import { MinusIcon } from "lucide-react"
import { cn } from "cn"

function InputOTP({ className, ...props }: OTPFieldPrimitive.Root.Props) {
  return (
    <OTPFieldPrimitive.Root
      data-slot="input-otp"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function InputOTPInput({ className, ...props }: OTPFieldPrimitive.Input.Props) {
  return (
    <OTPFieldPrimitive.Input
      data-slot="input-otp-input"
      className={cn(
        "h-9 w-9 rounded-lg border border-input bg-transparent text-center text-sm shadow-xs transition-all outline-none focus-visible:z-10 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

function InputOTPSeparator({
  className,
  children,
  ...props
}: OTPFieldPrimitive.Separator.Props) {
  return (
    <OTPFieldPrimitive.Separator
      data-slot="input-otp-separator"
      className={cn("text-muted-foreground", className)}
      {...props}
    >
      {children ?? <MinusIcon className="size-4" />}
    </OTPFieldPrimitive.Separator>
  )
}

export { InputOTP, InputOTPInput, InputOTPSeparator }
