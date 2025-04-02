import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface AnimatedProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  labelPosition?: 'top' | 'side' | 'tooltip';
  className?: string;
  labelClassName?: string;
  color?: 'default' | 'gradient' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  formatLabel?: (value: number, max: number) => string;
}

const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  max = 100,
  showLabel = true,
  labelPosition = 'top',
  className,
  labelClassName,
  color = 'default',
  size = 'md',
  animated = true,
  formatLabel,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Animate value changes
  useEffect(() => {
    if (!animated) {
      setDisplayValue(value);
      return;
    }
    
    // Determine animation speed based on delta
    const delta = Math.abs(displayValue - value);
    const duration = Math.min(Math.max(delta * 15, 300), 1000); // Between 300ms and 1000ms
    
    let startTime: number | null = null;
    const startValue = displayValue;
    
    const animateValue = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Ease out cubic: https://easings.net/#easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(startValue + (value - startValue) * easeProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animateValue);
      }
    };
    
    requestAnimationFrame(animateValue);
  }, [value, animated]);
  
  const getProgressColor = () => {
    switch (color) {
      case 'gradient':
        return 'bg-gradient-to-r from-dark-green via-light-green to-accent-orange';
      case 'success':
        return 'bg-light-green';
      case 'warning':
        return 'bg-accent-orange';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-dark-green';
    }
  };
  
  const getProgressSize = () => {
    switch (size) {
      case 'sm':
        return 'h-2';
      case 'lg':
        return 'h-4';
      default:
        return 'h-3';
    }
  };
  
  const formattedLabel = formatLabel 
    ? formatLabel(displayValue, max) 
    : `${Math.round(displayValue)}${max > 1 ? `/${max}` : '%'}`;
  
  return (
    <div className={cn("w-full", className)}>
      {showLabel && labelPosition === 'top' && (
        <div className={cn("flex justify-between text-sm mb-2", labelClassName)}>
          <span className="text-dark-green font-medium">{formattedLabel}</span>
        </div>
      )}
      
      <div className={cn("relative", labelPosition === 'side' && "flex items-center gap-3")}>
        <div className={cn("flex-1 relative", animated && "overflow-hidden")}>
          <Progress 
            value={displayValue} 
            max={max}
            className={cn(
              "w-full rounded-full bg-light-green/20", 
              getProgressSize()
            )}
          />
          
          {animated && (
            <div
              className={cn(
                "absolute top-0 left-0 right-0 bottom-0 opacity-40",
                getProgressColor(),
                "animate-[shimmer_2s_ease-in-out_infinite]",
                "bg-[length:200%_100%]"
              )}
              style={{
                width: `${(displayValue / max) * 100}%`,
                borderRadius: 'inherit'
              }}
            />
          )}
        </div>
        
        {showLabel && labelPosition === 'side' && (
          <span className={cn("text-sm text-dark-green font-medium w-14 text-right", labelClassName)}>
            {formattedLabel}
          </span>
        )}
        
        {showLabel && labelPosition === 'tooltip' && (
          <div 
            className={cn(
              "absolute -top-8 px-2 py-1 bg-dark-green text-white text-xs rounded",
              "transition-all duration-200 transform",
              "shadow-md"
            )}
            style={{
              left: `calc(${(displayValue / max) * 100}% - 1rem)`,
              transform: `translateX(-50%) scale(${displayValue > 0 ? 1 : 0})`
            }}
          >
            {formattedLabel}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-dark-green rotate-45" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedProgress;