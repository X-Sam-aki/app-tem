import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'outline';
  showIcon?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, children, variant = 'default', showIcon = true, size = 'default', ...props }, ref) => {
    const baseClasses = "font-medium transition-all";
    
    const variantClasses = {
      default: "bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white",
      subtle: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
      outline: "bg-transparent border border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
    };
    
    const sizeClasses = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 text-sm",
      lg: "h-11 px-8 text-lg",
      icon: "h-10 w-10"
    };
    
    return (
      <Button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {showIcon && variant === 'default' && <Sparkles className="mr-2 h-4 w-4" />}
        {children}
      </Button>
    );
  }
);

PremiumButton.displayName = 'PremiumButton';

export { PremiumButton };