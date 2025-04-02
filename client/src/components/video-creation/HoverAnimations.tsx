import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp, MousePointer, Sparkles } from "lucide-react";

// Example video card with hover effects for preview
type PreviewCardProps = {
  animationType: string;
  intensity: number;
  highlightColor: string;
  enableGlow: boolean;
};

function PreviewCard({ animationType, intensity, highlightColor, enableGlow }: PreviewCardProps) {
  const getAnimationClass = () => {
    switch (animationType) {
      case "zoom":
        return "hover:scale-105";
      case "tilt":
        return "hover:rotate-2";
      case "lift":
        return "hover:-translate-y-2";
      case "pop":
        return "hover:scale-110";
      default:
        return "";
    }
  };
  
  const getIntensityStyle = () => {
    const transitionDuration = 100 + (intensity * 5);
    return { transition: `all ${transitionDuration}ms ease-in-out` };
  };
  
  const getGlowStyle = () => {
    if (!enableGlow) return {};
    
    const glowColor = highlightColor;
    const glowIntensity = intensity * 0.05;
    return { 
      boxShadow: `0 0 ${10 + intensity}px ${glowIntensity}rem ${glowColor}`
    };
  };

  return (
    <div 
      className={`w-full h-32 rounded-lg bg-secondary flex items-center justify-center ${getAnimationClass()}`}
      style={{
        ...getIntensityStyle(),
        ...getGlowStyle(),
        border: `2px solid ${enableGlow ? highlightColor : 'transparent'}`
      }}
    >
      <div className="text-center">
        <h3 className="font-medium">Preview Card</h3>
        <p className="text-sm text-muted-foreground">Hover to see effect</p>
      </div>
    </div>
  );
}

type HoverAnimationsProps = {
  isPremium: boolean;
};

export function HoverAnimations({ isPremium = false }: HoverAnimationsProps) {
  const [expanded, setExpanded] = useState(false);
  const [animationType, setAnimationType] = useState("zoom");
  const [intensity, setIntensity] = useState<number[]>([50]);
  const [highlightColor, setHighlightColor] = useState("#3b82f6");
  const [enableGlow, setEnableGlow] = useState(true);

  return (
    <Card className="w-full mb-6 border-muted-foreground/20">
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2">✨</span> Interactive Hover Animations
            {!isPremium && <span className="ml-2 text-xs bg-amber-600/20 text-amber-500 px-2 py-0.5 rounded-full">Premium</span>}
          </CardTitle>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        <CardDescription>
          Add attention-grabbing animations when viewers hover over your content
        </CardDescription>
      </CardHeader>
      
      {expanded && (
        <CardContent className={`${!isPremium ? 'opacity-70 pointer-events-none' : ''}`}>
          {!isPremium && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-b-lg">
              <Button variant="premium" onClick={() => window.location.href = '/premium-features'}>
                Upgrade to Premium
              </Button>
            </div>
          )}
          
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Animation Preview</Label>
              <PreviewCard 
                animationType={animationType}
                intensity={intensity[0]}
                highlightColor={highlightColor}
                enableGlow={enableGlow}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Animation Type</Label>
                  <RadioGroup value={animationType} onValueChange={setAnimationType} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="zoom" id="zoom" />
                      <Label htmlFor="zoom">Zoom</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tilt" id="tilt" />
                      <Label htmlFor="tilt">Tilt</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lift" id="lift" />
                      <Label htmlFor="lift">Lift</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pop" id="pop" />
                      <Label htmlFor="pop">Pop</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Animation Intensity</Label>
                    <span className="text-sm text-muted-foreground">{intensity[0]}%</span>
                  </div>
                  <Slider
                    value={intensity}
                    max={100}
                    step={5}
                    onValueChange={setIntensity}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Highlight Color</Label>
                  <Select 
                    value={highlightColor} 
                    onValueChange={setHighlightColor}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="#3b82f6">Blue</SelectItem>
                      <SelectItem value="#10b981">Green</SelectItem>
                      <SelectItem value="#ef4444">Red</SelectItem>
                      <SelectItem value="#f59e0b">Orange</SelectItem>
                      <SelectItem value="#8b5cf6">Purple</SelectItem>
                      <SelectItem value="#ec4899">Pink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enable-glow" 
                      checked={enableGlow}
                      onCheckedChange={setEnableGlow}
                    />
                    <Label htmlFor="enable-glow">Enable glow effect</Label>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Hover animations can increase viewer engagement by up to 30%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary p-4 rounded-md">
              <div className="flex items-start gap-3">
                <MousePointer className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">How It Works</h4>
                  <p className="text-sm text-muted-foreground">
                    These animations are applied to clickable product cards and elements in your videos, 
                    encouraging viewers to interact with your affiliate links and boosting conversion rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}