import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Heart, Share2, Eye, ShoppingCart, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedProductCardProps {
  title: string;
  price: string;
  image: string;
  platform: string;
  rating?: number;
  reviewCount?: number;
  onView?: () => void;
  onSelect?: () => void;
  className?: string;
  isAffiliate?: boolean;
}

const AnimatedProductCard: React.FC<AnimatedProductCardProps> = ({
  title,
  price,
  image,
  platform,
  rating,
  reviewCount,
  onView,
  onSelect,
  className,
  isAffiliate = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getPlatformColor = () => {
    switch (platform.toLowerCase()) {
      case 'amazon':
        return 'bg-orange-500';
      case 'walmart':
        return 'bg-blue-500';
      case 'temu':
        return 'bg-red-500';
      default:
        return 'bg-dark-green';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        y: -5, 
        transition: { duration: 0.2 }
      }}
      className={cn("relative", className)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden shadow-md border-light-green hover:shadow-xl transition-all duration-300">
        {/* Product Image with Overlay */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out"
            style={{
              transform: isHovered ? 'scale(1.1)' : 'scale(1)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Platform Badge */}
          <Badge className={cn("absolute top-2 left-2", getPlatformColor(), "text-white")}>
            {platform}
          </Badge>
          
          {/* Affiliate Badge */}
          {isAffiliate && (
            <Badge 
              className="absolute top-2 right-2 bg-gradient-to-r from-dark-green to-accent-orange text-white"
              variant="outline"
            >
              Affiliate
            </Badge>
          )}
          
          {/* Hover Action Icons */}
          <motion.div 
            className="absolute right-2 bottom-2 flex flex-col gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              size="icon" 
              variant="secondary" 
              className="bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm h-8 w-8"
            >
              <Heart className="h-4 w-4 text-red-500" />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              className="bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm h-8 w-8"
            >
              <Share2 className="h-4 w-4 text-dark-green" />
            </Button>
          </motion.div>
        </div>
        
        <CardHeader className="pb-2 pt-3">
          <h3 className="font-medium text-dark-green line-clamp-2 h-12">
            {title}
          </h3>
        </CardHeader>
        
        <CardContent className="pb-3">
          <div className="flex justify-between items-center">
            <div className="text-accent-orange font-bold">{price}</div>
            
            {rating && (
              <div className="flex items-center gap-1 text-sm">
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <svg 
                      key={i} 
                      className={cn(
                        "w-4 h-4", 
                        i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"
                      )} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-dark-green/70">
                  {reviewCount && `(${reviewCount})`}
                </span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 pb-3 flex gap-2">
          <Button 
            onClick={onView} 
            variant="outline" 
            className="text-dark-green border-light-green hover:bg-light-green/20 flex-1"
          >
            <Eye className="mr-1 h-4 w-4" /> View
          </Button>
          <Button 
            onClick={onSelect} 
            className="bg-gradient-to-r from-dark-green to-accent-orange hover:brightness-110 text-white flex-1"
          >
            <ArrowUpRight className="mr-1 h-4 w-4" /> Select
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AnimatedProductCard;