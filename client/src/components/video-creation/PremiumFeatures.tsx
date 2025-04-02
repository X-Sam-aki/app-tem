import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Crown, Sparkles } from "lucide-react";
import { EmojiReactionSystem } from "./EmojiReactionSystem";
import { CreatorDashboard } from "./CreatorDashboard";
import { HoverAnimations } from "./HoverAnimations";
import { SocialMediaSharePreview } from "./SocialMediaSharePreview";
import { ColorPaletteGenerator } from "./ColorPaletteGenerator";

// This is a mock user status - in a real app, this would come from your authentication context
// and backend verification of premium status
type User = {
  id: number;
  name: string;
  isPremium: boolean;
};

export function PremiumFeatures() {
  const [expanded, setExpanded] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Mock loading user - in a real app, this would be your auth state
  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setCurrentUser({
        id: 1,
        name: "Test User",
        isPremium: false // Set to false by default to show premium upgrade flow
      });
    }, 500);
  }, []);
  
  if (!currentUser) {
    return (
      <Card className="w-full mb-6 border-muted-foreground/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2">✨</span> Premium Features
          </CardTitle>
          <CardContent className="p-0">
            <div className="h-8 animate-pulse bg-muted rounded-md"></div>
          </CardContent>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full mb-6 border-muted-foreground/20">
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2">✨</span> Premium Features
            {!currentUser.isPremium && (
              <Button variant="premium" size="sm" className="ml-4" onClick={(e) => {
                e.stopPropagation();
                window.location.href = '/premium-features';
              }}>
                <Crown className="mr-2 h-4 w-4" />
                Upgrade
              </Button>
            )}
          </CardTitle>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        <CardDescription>
          Enhance your video marketing with advanced features and analytics
        </CardDescription>
      </CardHeader>
      
      {expanded && (
        <CardContent>
          <div className="space-y-6">
            {!currentUser.isPremium && (
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 rounded-lg p-4 mb-6 border border-amber-200 dark:border-amber-900/50">
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800 dark:text-amber-400">Upgrade to Premium</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                      Unlock advanced creator tools, analytics, and engagement features to supercharge your affiliate marketing campaigns.
                    </p>
                    <div className="mt-3">
                      <Button variant="premium" onClick={() => window.location.href = '/premium-features'}>
                        <Crown className="mr-2 h-4 w-4" />
                        View Premium Plans
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <EmojiReactionSystem isPremium={currentUser.isPremium} />
            <CreatorDashboard isPremium={currentUser.isPremium} />
            <HoverAnimations isPremium={currentUser.isPremium} />
            <SocialMediaSharePreview />
            <ColorPaletteGenerator isPremium={currentUser.isPremium} />
          </div>
        </CardContent>
      )}
    </Card>
  );
}