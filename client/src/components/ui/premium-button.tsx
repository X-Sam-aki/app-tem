import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumButtonProps extends ButtonProps {
  premiumFeature?: string;
  showSparkles?: boolean;
  sparkleAnimation?: boolean;
  className?: string;
}

const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  premiumFeature,
  showSparkles = true,
  sparkleAnimation = true,
  className,
  ...props
}) => {
  return (
    <Button
      className={cn(
        "relative group overflow-hidden",
        "bg-gradient-to-r from-dark-green to-accent-orange border-none text-white",
        "hover:from-accent-orange hover:to-dark-green",
        "transition-all duration-500",
        className
      )}
      {...props}
    >
      {/* Inner Content */}
      <div className="flex items-center gap-2 z-10 relative">
        {showSparkles && (
          <Sparkles 
            className={cn(
              "h-4 w-4", 
              sparkleAnimation && "text-yellow-300 animate-pulse"
            )} 
          />
        )}
        {children}
      </div>
      
      {/* Premium Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 via-accent-orange/20 to-yellow-300/20 bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]"></div>
      </div>
      
      {/* Premium Feature Tooltip */}
      {premiumFeature && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-max px-3 py-1.5 bg-dark-green text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none">
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>{premiumFeature}</span>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-dark-green rotate-45"></div>
        </div>
      )}
    </Button>
  );
};

export default PremiumButton;