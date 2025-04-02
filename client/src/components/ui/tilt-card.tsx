import React, { useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltFactor?: number;
  glareOpacity?: number;
  scale?: number;
  perspective?: number;
  disabled?: boolean;
  glare?: boolean;
  transitionDuration?: number;
  maxTiltDegrees?: number;
}

const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className,
  tiltFactor = 10,
  glareOpacity = 0.35,
  scale = 1.05,
  perspective = 1000,
  disabled = false,
  glare = true,
  transitionDuration = 300,
  maxTiltDegrees = 20,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate mouse position relative to card center
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate tilt amount (constrained by maxTiltDegrees)
    const tiltX = Math.min(Math.max((mouseY / (rect.height / 2)) * tiltFactor, -maxTiltDegrees), maxTiltDegrees);
    const tiltY = Math.min(Math.max(-(mouseX / (rect.width / 2)) * tiltFactor, -maxTiltDegrees), maxTiltDegrees);
    
    // Calculate glare position
    const glareX = (mouseX / rect.width) * 100 + 50;
    const glareY = (mouseY / rect.height) * 100 + 50;
    
    setGlarePosition({ x: glareX, y: glareY });
    setTransform(`perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative overflow-hidden',
        'transform-gpu',
        className
      )}
      style={{
        transform: isHovered ? transform : 'none',
        transition: `transform ${transitionDuration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {glare && isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, ${glareOpacity}) 0%, rgba(255, 255, 255, 0) 70%)`,
            transition: `opacity ${transitionDuration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
            opacity: isHovered ? 1 : 0
          }}
        />
      )}
    </div>
  );
};

export default TiltCard;