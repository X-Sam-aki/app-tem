import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSkeletonProps {
  className?: string;
  shape?: 'circle' | 'rectangle' | 'card' | 'text' | 'button';
  count?: number;
  isLoading?: boolean;
  children?: React.ReactNode;
  animated?: boolean;
}

const AnimatedSkeleton: React.FC<AnimatedSkeletonProps> = ({
  className,
  shape = 'rectangle',
  count = 1,
  isLoading = true,
  children,
  animated = true,
}) => {
  const renderSkeleton = () => {
    const skeletons = [];
    
    for (let i = 0; i < count; i++) {
      let skeletonClass = '';
      
      switch (shape) {
        case 'circle':
          skeletonClass = 'h-12 w-12 rounded-full';
          break;
        case 'card':
          skeletonClass = 'h-32 rounded-lg w-full';
          break;
        case 'text':
          skeletonClass = 'h-4 rounded w-full';
          break;
        case 'button':
          skeletonClass = 'h-10 rounded-md w-24';
          break;
        default:
          skeletonClass = 'h-6 rounded w-full';
      }
      
      skeletons.push(
        <div
          key={i}
          className={cn(
            "bg-gradient-to-r from-light-green/20 via-cream/30 to-light-green/20 bg-[length:400%_100%]",
            animated && "animate-skeleton",
            skeletonClass,
            className,
            { "mb-2": i < count - 1 && count > 1 }
          )}
        />
      );
    }
    
    return skeletons;
  };
  
  if (!isLoading) {
    return <>{children}</>;
  }
  
  return <>{renderSkeleton()}</>;
};

export default AnimatedSkeleton;

// Add to your tailwind.config.ts:
// animation: {
//   skeleton: 'shimmer 2s infinite',
// },
// keyframes: {
//   shimmer: {
//     '0%': { backgroundPosition: '200% 0' },
//     '100%': { backgroundPosition: '0% 0' },
//   },
// },