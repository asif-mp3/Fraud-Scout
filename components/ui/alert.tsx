import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-green-400 bg-green-100 text-green-700 dark:border-green-400/30 dark:bg-green-900/30 dark:text-green-300",
        info:
          "border-blue-400 bg-blue-100 text-blue-700 dark:border-blue-400/30 dark:bg-blue-900/30 dark:text-blue-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants> & {
    title?: string
    description?: string
    onClose?: () => void
  }
>(({ className, variant, title, description, onClose, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  >
    <div className="flex items-start justify-between">
      <div>
        {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
        {description && <div className="text-sm [&_p]:leading-relaxed">{description}</div>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 rounded-full p-1 transition-colors hover:bg-secondary"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
    </div>
  </div>
))
Alert.displayName = "Alert"

// Define AlertDescription component
const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-sm [&_p]:leading-relaxed">{children}</div>
)

// Define AlertTitle component
const AlertTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h5 className="mb-1 font-medium leading-none tracking-tight">{children}</h5>
)

export { Alert, alertVariants, AlertDescription, AlertTitle }
