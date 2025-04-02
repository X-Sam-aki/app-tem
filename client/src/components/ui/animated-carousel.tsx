import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedCarouselProps {
  images: string[];
  autoplay?: boolean;
  interval?: number;
  className?: string;
  showIndicators?: boolean;
  showArrows?: boolean;
  imageClassName?: string;
}

const AnimatedCarousel: React.FC<AnimatedCarouselProps> = ({
  images,
  autoplay = true,
  interval = 5000,
  className,
  showIndicators = true,
  showArrows = true,
  imageClassName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with the CSS transition duration
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with the CSS transition duration
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with the CSS transition duration
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoplay && images.length > 1) {
      timer = setInterval(nextSlide, interval);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoplay, interval, currentIndex, images.length]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      {/* Main carousel container */}
      <div className="relative h-full w-full overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-all duration-500 ease-in-out",
              {
                "opacity-100 translate-x-0 z-10": index === currentIndex,
                "opacity-0 -translate-x-full z-0": index < currentIndex,
                "opacity-0 translate-x-full z-0": index > currentIndex,
              }
            )}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className={cn(
                "h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105",
                imageClassName
              )}
            />
            {/* Add a subtle gradient overlay for better text visibility if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/50 hover-scale"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/50 hover-scale"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                {
                  "w-8 bg-accent-orange": index === currentIndex,
                  "bg-white/50 hover:bg-white/80": index !== currentIndex,
                }
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimatedCarousel;