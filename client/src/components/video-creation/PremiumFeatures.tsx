import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  BarChart3, 
  Heart, 
  Share2, 
  Palette,
  Lock
} from 'lucide-react';

const PremiumFeatures = () => {
  const features = [
    {
      id: 'emoji-reaction',
      title: 'Emoji Reaction System',
      description: 'Add interactive emoji reactions to your videos to boost engagement',
      icon: <Heart className="h-5 w-5" />,
      comingSoon: false
    },
    {
      id: 'creator-dashboard',
      title: 'Creator Dashboard',
      description: 'Gain insights with advanced analytics and performance metrics',
      icon: <BarChart3 className="h-5 w-5" />,
      comingSoon: false
    },
    {
      id: 'hover-animations',
      title: 'Interactive Hover Animations',
      description: 'Create eye-catching hover effects for product thumbnails',
      icon: <Sparkles className="h-5 w-5" />,
      comingSoon: false
    },
    {
      id: 'share-preview',
      title: 'Social Media Share Preview',
      description: 'Preview how your content will appear across different platforms',
      icon: <Share2 className="h-5 w-5" />,
      comingSoon: false
    },
    {
      id: 'color-palette',
      title: 'AI-powered Color Palette Generator',
      description: 'Automatically generate optimized color schemes for your thumbnails',
      icon: <Palette className="h-5 w-5" />,
      comingSoon: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map((feature) => (
        <Card key={feature.id} className="overflow-hidden relative bg-white/10 border border-white/20 backdrop-blur-sm">
          <div className="absolute top-0 right-0 p-2">
            <Lock className="h-4 w-4 text-amber-500" />
          </div>
          
          <CardContent className="p-5">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-purple-700/30 p-2 rounded-full">
                {feature.icon}
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
            </div>
            
            <p className="text-sm text-white/80 mb-4">{feature.description}</p>
            
            <div className="flex items-center justify-between">
              {feature.comingSoon ? (
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              ) : (
                <Badge variant="outline" className="text-xs bg-amber-500/20 text-amber-300 border-amber-500/30">Available</Badge>
              )}
              
              <Link href="/premium-features">
                <Button variant="ghost" size="sm" className="text-xs hover:bg-white/10">
                  Upgrade
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PremiumFeatures;