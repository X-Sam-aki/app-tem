import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
  icon?: LucideIcon;
  animationStyle?: 'pulse' | 'ripple' | 'bounce' | 'float' | 'none';
  iconPosition?: 'left' | 'right';
  label?: string;
  isLoading?: boolean;
  loadingText?: string;
  gradient?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  icon: Icon,
  animationStyle = 'pulse',
  iconPosition = 'left',
  label,
  isLoading = false,
  loadingText = 'Loading...',
  gradient = false,
  className,
  children,
  ...props
}) => {
  const getAnimationClass = () => {
    switch (animationStyle) {
      case 'pulse':
        return 'animate-pulse';
      case 'ripple':
        return 'animate-ripple';
      case 'bounce':
        return 'hover:animate-[bounce_1s_ease-in-out]';
      case 'float':
        return 'hover:animate-float';
      default:
        return '';
    }
  };

  const buttonContent = (
    <>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-light-green border-t-transparent" />
          <span>{loadingText}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {Icon && iconPosition === 'left' && <Icon className="h-5 w-5" />}
          {label || children}
          {Icon && iconPosition === 'right' && <Icon className="h-5 w-5" />}
        </div>
      )}
    </>
  );

  return (
    <Button
      className={cn(
        getAnimationClass(),
        gradient ? 'bg-gradient-to-r from-dark-green to-accent-orange text-white hover:from-accent-orange hover:to-dark-green' : '',
        isLoading ? 'cursor-not-allowed opacity-80' : '',
        'relative overflow-hidden transition-all duration-300',
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {buttonContent}
      <span className="absolute inset-0 -z-10 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
    </Button>
  );
};

export default AnimatedButton;