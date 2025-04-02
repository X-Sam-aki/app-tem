import React, { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';

type TransitionEffect = 'fade' | 'slide' | 'zoom' | 'flip' | 'none';

interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
  transition?: TransitionEffect;
  duration?: number;
  delay?: number;
}

const pageVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  },
  zoom: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 },
  },
  flip: {
    initial: { rotateY: 90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
};

const AnimatedPage: React.FC<AnimatedPageProps> = ({
  children,
  className,
  transition = 'fade',
  duration = 0.4,
  delay = 0,
}) => {
  const [location] = useLocation();
  const [key, setKey] = useState(location);
  
  // Update key when location changes to trigger animation
  useEffect(() => {
    setKey(location);
  }, [location]);
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants[transition]}
        transition={{ 
          duration, 
          delay,
          ease: [0.22, 1, 0.36, 1]  // Custom cubic bezier for smooth transitions
        }}
        className={cn(
          "w-full h-full",
          className
        )}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedPage;