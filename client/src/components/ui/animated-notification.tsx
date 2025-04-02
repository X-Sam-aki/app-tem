import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { XCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface AnimatedNotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  className?: string;
  showIcon?: boolean;
  autoClose?: boolean;
}

const AnimatedNotification: React.FC<AnimatedNotificationProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose,
  className,
  showIcon = true,
  autoClose = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoClose) {
      timer = setTimeout(() => {
        handleClose();
      }, duration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsExiting(true);
    
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300); // Match this with the CSS transition duration
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'border-light-green bg-light-green/10';
      case 'error':
        return 'border-red-300 bg-red-50';
      case 'warning':
        return 'border-accent-orange bg-accent-orange/10';
      case 'info':
      default:
        return 'border-dark-green bg-dark-green/10';
    }
  };

  return (
    <Alert
      className={cn(
        getColorClasses(),
        'relative overflow-hidden transition-all duration-300',
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0',
        'animate-slide-right',
        className
      )}
    >
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_ease-in-out_infinite] bg-[length:200%_100%] opacity-60" />
      
      <div className="relative z-10 flex items-start gap-3">
        {showIcon && <div className="mt-0.5">{getIcon()}</div>}
        
        <div className="flex-1">
          <AlertTitle className="text-dark-green font-medium">{title}</AlertTitle>
          <AlertDescription className="text-dark-green/80 mt-1">
            {message}
          </AlertDescription>
        </div>
        
        <button
          onClick={handleClose}
          className="text-dark-green/40 hover:text-dark-green transition-colors"
          aria-label="Close notification"
        >
          <XCircle className="h-5 w-5" />
        </button>
      </div>
    </Alert>
  );
};

export default AnimatedNotification;