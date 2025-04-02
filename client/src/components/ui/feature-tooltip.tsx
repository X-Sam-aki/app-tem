import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureTooltipProps {
  title: string;
  description: string;
  badgeText?: string;
  children: React.ReactNode;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  showSparkle?: boolean;
  premium?: boolean;
}

const FeatureTooltip: React.FC<FeatureTooltipProps> = ({
  title,
  description,
  badgeText = "New",
  children,
  className,
  side = 'top',
  showSparkle = true,
  premium = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip
        open={isOpen} 
        onOpenChange={setIsOpen}
        delayDuration={300}
      >
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "relative group cursor-help", 
              isOpen && "z-50",
              className
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {showSparkle && (
              <span className="absolute -right-1 -top-1 animate-pulse text-accent-orange">
                <Sparkles className="h-4 w-4" />
              </span>
            )}
            {children}
          </div>
        </TooltipTrigger>
        
        <TooltipContent
          side={side}
          className="w-64 p-0 overflow-hidden bg-cream border border-light-green shadow-lg"
        >
          <div className="relative">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-dark-green/20 via-light-green/10 to-accent-orange/20 animate-[shimmer_3s_ease-in-out_infinite] bg-[length:200%_100%] z-0" />
            
            <div className="relative z-10 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-dark-green">{title}</h3>
                <Badge variant="outline" className={cn(
                  "text-xs font-medium border px-2 py-0.5",
                  premium 
                    ? "bg-gradient-to-r from-dark-green to-accent-orange text-white border-none" 
                    : "bg-light-green/20 text-dark-green border-light-green"
                )}>
                  {badgeText}
                </Badge>
              </div>
              
              <p className="text-sm text-dark-green/80">{description}</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FeatureTooltip;