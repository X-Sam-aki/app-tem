import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Crown, 
  ArrowRight, 
  Zap, 
  Sparkles, 
  ChevronLeft, 
  BarChart3, 
  Share2, 
  Palette, 
  Star 
} from "lucide-react";
import { Link } from "wouter";

const features = {
  basic: [
    "Product extraction from Amazon, Walmart, Temu",
    "Basic video templates",
    "720p video quality",
    "Limited customization options",
    "Manual publishing to YouTube",
    "Standard support"
  ],
  pro: [
    "All Basic features",
    "Advanced video templates",
    "1080p HD video quality",
    "Emoji reaction system",
    "Interactive hover animations",
    "One-click social media sharing",
    "AI-powered thumbnail generator",
    "Priority support"
  ],
  business: [
    "All Pro features",
    "4K video quality",
    "Personalized creator dashboard",
    "Advanced analytics & insights",
    "Bulk video creation",
    "Cross-platform publishing",
    "Custom branding",
    "Dedicated account manager"
  ]
};

export default function PremiumFeatures() {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  
  const plans = [
    {
      name: "Basic",
      description: "Essential features for beginners",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: features.basic,
      highlighted: false,
      badge: null,
      buttonText: "Current Plan",
      buttonVariant: "outline" as const
    },
    {
      name: "Pro",
      description: "Perfect for growing creators",
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      features: features.pro,
      highlighted: true,
      badge: "Most Popular",
      buttonText: "Upgrade to Pro",
      buttonVariant: "premium" as const
    },
    {
      name: "Business",
      description: "For serious affiliate marketers",
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      features: features.business,
      highlighted: false,
      badge: "Advanced",
      buttonText: "Upgrade to Business",
      buttonVariant: "default" as const
    }
  ];

  return (
    <div className="container max-w-6xl py-10">
      <div className="mb-10">
        <Link to="/dashboard" className="flex items-center text-sm text-muted-foreground mb-2 hover:text-primary transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>
        
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Crown className="mr-2 h-6 w-6 text-amber-500" />
          Premium Features
        </h1>
        <p className="text-muted-foreground">
          Unlock advanced features to supercharge your affiliate marketing videos
        </p>
      </div>
      
      <div className="flex justify-center mb-8">
        <Tabs 
          defaultValue="monthly" 
          value={billingInterval}
          onValueChange={(value) => setBillingInterval(value as "monthly" | "yearly")}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                Save 16%
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative ${plan.highlighted ? 'border-primary shadow-lg' : ''}`}
          >
            {plan.badge && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  plan.highlighted 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  {plan.badge}
                </span>
              </div>
            )}
            
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  ${billingInterval === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                </span>
                <span className="text-muted-foreground">
                  /{billingInterval === "monthly" ? "month" : "year"}
                </span>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant={plan.buttonVariant} 
                className="w-full"
              >
                {plan.buttonText}
                {plan.name !== "Basic" && <ArrowRight className="ml-1.5 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-16 space-y-12">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Premium Features Comparison</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2 text-center">
              <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Emoji Reaction System</h3>
              <p className="text-sm text-muted-foreground">
                Add engaging emoji reactions to highlight product features in your videos
              </p>
            </div>
            
            <div className="space-y-2 text-center">
              <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Creator Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Track performance with detailed analytics and audience insights
              </p>
            </div>
            
            <div className="space-y-2 text-center">
              <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Hover Animations</h3>
              <p className="text-sm text-muted-foreground">
                Add interactive animations for more engaging content
              </p>
            </div>
            
            <div className="space-y-2 text-center">
              <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">AI Color Generator</h3>
              <p className="text-sm text-muted-foreground">
                Create eye-catching thumbnails with AI-generated color palettes
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-muted rounded-lg p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 rounded-full p-3 shrink-0">
                <Star className="h-6 w-6 text-primary" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2">Boost Your Affiliate Marketing Success</h3>
                <p className="text-muted-foreground mb-4">
                  Premium creators generate up to 5x more engagement and 3x higher conversion rates compared to basic users. 
                  Upgrade today to unlock all the tools you need to create professional, high-converting affiliate videos.
                </p>
                
                <Button variant="premium" size="lg">
                  <Crown className="mr-2 h-5 w-5" />
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-bold mb-3">Need Help Deciding?</h3>
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
            Contact our team for a personalized consultation to find the perfect plan for your affiliate marketing needs.
          </p>
          <Button variant="outline">Contact Sales</Button>
        </div>
      </div>
    </div>
  );
}