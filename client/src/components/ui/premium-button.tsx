import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Crown } from "lucide-react"

export interface PremiumButtonProps extends ButtonProps {}

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700",
          className
        )}
        {...props}
      >
        <Crown className="mr-2 h-4 w-4" />
        {children || "Upgrade to Premium"}
      </Button>
    )
  }
)
PremiumButton.displayName = "PremiumButton"

export { PremiumButton }