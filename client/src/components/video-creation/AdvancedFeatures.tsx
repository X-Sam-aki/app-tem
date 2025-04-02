import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LockIcon, BrushIcon, TrendingUpIcon, ZapIcon, ShareIcon, EyeIcon, LayersIcon, BotIcon, GlobeIcon } from "lucide-react";

// Type definition for premium features
interface PremiumFeature {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  enabled?: boolean;
}

// Features available in the premium version
const premiumFeatures: PremiumFeature[] = [
  {
    id: 'color-palette',
    title: 'Personalized color palette suggestion for video branding',
    icon: <BrushIcon className="h-4 w-4 mr-2" />,
    description: 'AI-generated color schemes that match your brand identity and boost engagement',
  },
  {
    id: 'engagement-prediction',
    title: 'Real-time engagement prediction for affiliate content',
    icon: <TrendingUpIcon className="h-4 w-4 mr-2" />,
    description: 'Predictive analytics to optimize your video for maximum conversion rates',
  },
  {
    id: 'transition-effects',
    title: 'Animated transition effects for product showcases',
    icon: <ZapIcon className="h-4 w-4 mr-2" />,
    description: 'Professional animations that highlight product features effectively',
  },
  {
    id: 'social-optimization',
    title: 'One-click social media optimization for video templates',
    icon: <ShareIcon className="h-4 w-4 mr-2" />,
    description: 'Auto-adjust your video dimensions and style for each social platform',
  },
  {
    id: 'thumbnail-generator',
    title: 'Interactive product preview thumbnail generator',
    icon: <EyeIcon className="h-4 w-4 mr-2" />,
    description: 'Create eye-catching thumbnails that drive higher click-through rates',
  },
  {
    id: 'cross-platform',
    title: 'Cross-platform publishing (TikTok, Instagram Reels)',
    icon: <GlobeIcon className="h-4 w-4 mr-2" />,
    description: 'Push your content to multiple platforms with just one click',
  },
  {
    id: 'templates',
    title: 'Additional video templates and advanced customization',
    icon: <LayersIcon className="h-4 w-4 mr-2" />,
    description: 'Access to premium templates designed for higher conversion rates',
  },
  {
    id: 'ai-descriptions',
    title: 'Advanced AI-enhanced product descriptions',
    icon: <BotIcon className="h-4 w-4 mr-2" />,
    description: 'Generate compelling product descriptions that drive sales',
  },
  {
    id: 'multi-platform',
    title: 'Multi-platform support (Amazon, Walmart, etc.)',
    icon: <GlobeIcon className="h-4 w-4 mr-2" />,
    description: 'Extract products from additional e-commerce platforms including Amazon! Create diverse affiliate content for better reach.',
    enabled: true, // This premium feature is now available
  },
];

export function AdvancedFeatures() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const toggleFeature = (featureId: string) => {
    // For the demo, just toggle the selection state
    if (selectedFeatures.includes(featureId)) {
      setSelectedFeatures(selectedFeatures.filter(id => id !== featureId));
    } else {
      setSelectedFeatures([...selectedFeatures, featureId]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Advanced Features</CardTitle>
            <CardDescription>Premium features to enhance your videos</CardDescription>
          </div>
          <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-300">
            Premium
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {premiumFeatures.map((feature) => (
            <div 
              key={feature.id} 
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                feature.enabled 
                  ? 'border-amber-300 bg-amber-50/50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  {feature.icon}
                  <span className="font-medium text-sm">
                    {feature.title}
                    {feature.enabled && (
                      <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300 text-xs">
                        Active
                      </Badge>
                    )}
                  </span>
                </div>
                <p className="text-xs text-gray-500 ml-6">{feature.description}</p>
              </div>
              <div className="flex items-center ml-4">
                <Switch
                  id={`feature-${feature.id}`}
                  disabled={!feature.enabled}
                  checked={feature.enabled || selectedFeatures.includes(feature.id)}
                  onCheckedChange={() => toggleFeature(feature.id)}
                />
                {!feature.enabled && <LockIcon className="ml-2 h-4 w-4 text-gray-400" />}
              </div>
            </div>
          ))}
          
          <div className="mt-6 text-center">
            <Button variant="default" className="w-full sm:w-auto px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              Upgrade to Premium
            </Button>
            <p className="mt-2 text-xs text-gray-500">Unlock all advanced features and take your affiliate marketing to the next level</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}