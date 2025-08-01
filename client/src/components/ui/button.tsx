import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "glass-button dark:glass-button-dark text-foreground font-semibold shadow-lg hover:shadow-xl",
        destructive:
          "glass-button dark:glass-button-dark bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-500/30",
        outline:
          "glass-button dark:glass-button-dark border-2 text-foreground hover:bg-accent/50",
        secondary:
          "glass-button dark:glass-button-dark bg-secondary/60 text-secondary-foreground border-secondary/30",
        ghost: "backdrop-blur-sm bg-transparent hover:glass-button dark:hover:glass-button-dark text-foreground",
        link: "text-primary underline-offset-4 hover:underline bg-transparent",
        glass: "glass-button dark:glass-button-dark text-foreground font-medium",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
