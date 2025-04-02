import { cn } from '@/lib/utils';

interface AnimatedSkeletonProps {
  className?: string;
  variant?: 'line' | 'circle' | 'rectangle' | 'card' | 'profile' | 'video';
  count?: number;
  width?: string;
  height?: string;
}

const AnimatedSkeleton = ({
  className,
  variant = 'line',
  count = 1,
  width,
  height,
}: AnimatedSkeletonProps) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'line':
        return (
          <div
            className={cn(
              'h-4 bg-white/10 rounded-md animate-pulse',
              width ? width : 'w-full',
              className
            )}
          />
        );
      case 'circle':
        return (
          <div
            className={cn(
              'rounded-full bg-white/10 animate-pulse',
              width ? width : 'w-12',
              height ? height : 'h-12',
              className
            )}
          />
        );
      case 'rectangle':
        return (
          <div
            className={cn(
              'rounded-md bg-white/10 animate-pulse',
              width ? width : 'w-full',
              height ? height : 'h-24',
              className
            )}
          />
        );
      case 'card':
        return (
          <div className={cn('card-gradient rounded-xl p-4 animate-pulse', className)}>
            <div className="space-y-3">
              <div className="h-4 bg-white/10 rounded-md w-3/4" />
              <div className="h-3 bg-white/10 rounded-md w-full" />
              <div className="h-3 bg-white/10 rounded-md w-5/6" />
              <div className="pt-2">
                <div className="h-6 bg-white/10 rounded-md w-1/3" />
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className={cn('flex items-center space-x-4', className)}>
            <div className="rounded-full bg-white/10 w-12 h-12 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded-md w-32 animate-pulse" />
              <div className="h-3 bg-white/10 rounded-md w-24 animate-pulse" />
            </div>
          </div>
        );
      case 'video':
        return (
          <div className={cn('space-y-2', className)}>
            <div 
              className={cn(
                'relative rounded-lg bg-white/10 animate-pulse', 
                width ? width : 'w-full',
                height ? height : 'h-40'
              )}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/20" />
              </div>
            </div>
            <div className="h-4 bg-white/10 rounded-md w-3/4 animate-pulse" />
            <div className="h-3 bg-white/10 rounded-md w-1/2 animate-pulse" />
          </div>
        );
      default:
        return null;
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

export default AnimatedSkeleton;