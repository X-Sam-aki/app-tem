import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  effect?: 'typewriter' | 'fade' | 'gradient' | 'highlight' | 'wave';
  highlightColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  speed?: 'slow' | 'medium' | 'fast';
  delay?: number;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  replay?: boolean;
  once?: boolean;
  onComplete?: () => void;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  effect = 'typewriter',
  highlightColor = 'accent-orange',
  gradientFrom = 'dark-green',
  gradientTo = 'accent-orange',
  speed = 'medium',
  delay = 0,
  tag: Tag = 'h2',
  replay = false,
  once = false,
  onComplete,
}) => {
  const [displayText, setDisplayText] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const getSpeedValue = () => {
    switch (speed) {
      case 'slow':
        return 100;
      case 'fast':
        return 30;
      default:
        return 50;
    }
  };
  
  const startTypewriterAnimation = () => {
    if ((once && hasAnimated) || isAnimating) return;
    
    setIsAnimating(true);
    setDisplayText('');
    
    let currentIndex = 0;
    const characters = text.split('');
    
    const typeNextChar = () => {
      if (currentIndex < characters.length) {
        setDisplayText(prev => prev + characters[currentIndex]);
        currentIndex++;
        setTimeout(typeNextChar, getSpeedValue());
      } else {
        setIsAnimating(false);
        setHasAnimated(true);
        if (onComplete) onComplete();
      }
    };
    
    setTimeout(typeNextChar, delay);
  };
  
  useEffect(() => {
    if (effect !== 'typewriter') return;
    
    if (replay) {
      startTypewriterAnimation();
    } else {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            startTypewriterAnimation();
            if (once && observerRef.current && elementRef.current) {
              observerRef.current.unobserve(elementRef.current);
            }
          }
        },
        { threshold: 0.1 }
      );
      
      if (elementRef.current) {
        observerRef.current.observe(elementRef.current);
      }
    }
    
    return () => {
      if (observerRef.current && elementRef.current) {
        observerRef.current.unobserve(elementRef.current);
      }
    };
  }, [text, effect, replay, once]);
  
  // Reset animation when text changes
  useEffect(() => {
    if (effect === 'typewriter') {
      setDisplayText('');
      setHasAnimated(false);
    }
  }, [text, effect]);
  
  const renderContent = () => {
    switch (effect) {
      case 'typewriter':
        return <span>{displayText}<span className="animate-pulse">|</span></span>;
      
      case 'fade':
        return (
          <span className="inline-block">
            {text.split('').map((char, index) => (
              <span
                key={index}
                className="inline-block opacity-0 animate-fade-in"
                style={{ animationDelay: `${delay + (index * 50)}ms` }}
              >
                {char}
              </span>
            ))}
          </span>
        );
      
      case 'gradient':
        return (
          <span className={`bg-gradient-to-r from-${gradientFrom} to-${gradientTo} text-transparent bg-clip-text`}>
            {text}
          </span>
        );
      
      case 'highlight':
        return (
          <span className="relative">
            {text}
            <span 
              className={`absolute bottom-0 left-0 w-full h-[30%] bg-${highlightColor}/30 -z-10 transform -skew-x-12`}
              style={{
                animation: 'slideRight 1s ease-out forwards',
                animationDelay: `${delay}ms`,
              }}
            />
          </span>
        );
      
      case 'wave':
        return (
          <span className="inline-block">
            {text.split('').map((char, index) => (
              <span
                key={index}
                className="inline-block transform-gpu animate-bounce-animation"
                style={{ 
                  animationDelay: `${(index * 50)}ms`,
                  animationDuration: '1s'
                }}
              >
                {char}
              </span>
            ))}
          </span>
        );
      
      default:
        return text;
    }
  };
  
  return (
    <Tag 
      ref={elementRef}
      className={cn(
        "relative inline-block",
        className
      )}
    >
      {renderContent()}
    </Tag>
  );
};

export default AnimatedText;