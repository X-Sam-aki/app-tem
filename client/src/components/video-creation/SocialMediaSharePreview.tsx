import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Copy, Check, ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import { SiYoutube, SiInstagram, SiTiktok } from "react-icons/si";

export function SocialMediaSharePreview() {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("youtube");
  const [copied, setCopied] = useState(false);
  const [enableHashtags, setEnableHashtags] = useState(true);
  const [enableCTA, setEnableCTA] = useState(true);
  const [shareTitle, setShareTitle] = useState("Check out this amazing product I found! #affiliate #shorts");
  const [shareDescription, setShareDescription] = useState("This innovative product will change your life! Click the link in my bio to get yours with a special discount.");
  
  const handleCopyText = () => {
    navigator.clipboard.writeText(`${shareTitle}\n\n${shareDescription}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const platformStyles = {
    youtube: {
      bg: "bg-red-100 dark:bg-red-950/30",
      icon: <SiYoutube className="h-6 w-6 text-red-600" />,
      name: "YouTube"
    },
    instagram: {
      bg: "bg-purple-100 dark:bg-purple-950/30",
      icon: <SiInstagram className="h-6 w-6 text-purple-600" />,
      name: "Instagram"
    },
    tiktok: {
      bg: "bg-black/10 dark:bg-black/30",
      icon: <SiTiktok className="h-6 w-6 text-black dark:text-white" />,
      name: "TikTok"
    }
  };

  return (
    <Card className="w-full mb-6 border-muted-foreground/20">
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2">🔗</span> One-Click Social Media Share Preview
          </CardTitle>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        <CardDescription>
          Preview and customize how your content will appear on different platforms
        </CardDescription>
      </CardHeader>
      
      {expanded && (
        <CardContent>
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="youtube" className="flex-1 flex items-center justify-center">
                  <SiYoutube className="mr-2 h-4 w-4" />
                  YouTube
                </TabsTrigger>
                <TabsTrigger value="instagram" className="flex-1 flex items-center justify-center">
                  <SiInstagram className="mr-2 h-4 w-4" />
                  Instagram
                </TabsTrigger>
                <TabsTrigger value="tiktok" className="flex-1 flex items-center justify-center">
                  <SiTiktok className="mr-2 h-4 w-4" />
                  TikTok
                </TabsTrigger>
              </TabsList>

              {["youtube", "instagram", "tiktok"].map((platform) => (
                <TabsContent key={platform} value={platform} className="space-y-4">
                  <div className={`${platformStyles[platform as keyof typeof platformStyles].bg} p-4 rounded-lg`}>
                    <div className="flex items-center mb-3">
                      {platformStyles[platform as keyof typeof platformStyles].icon}
                      <span className="ml-2 font-medium">{platformStyles[platform as keyof typeof platformStyles].name} Preview</span>
                    </div>
                    
                    <div className="bg-background rounded-lg p-3 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                          <span className="text-xl">👤</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <p className="font-medium">Your Channel</p>
                            <p className="text-xs text-muted-foreground ml-2">• Just now</p>
                          </div>
                          <p className="mt-1">{shareTitle}</p>
                          <p className="text-sm text-muted-foreground mt-1">{shareDescription}</p>
                          
                          <div className="h-32 mt-3 bg-secondary rounded-md flex items-center justify-center">
                            <p className="text-muted-foreground">Video thumbnail preview</p>
                          </div>
                          
                          <div className="flex items-center mt-3 space-x-4">
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span className="text-sm">Like</span>
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span className="text-sm">Comment</span>
                            </div>
                            <div className="flex items-center">
                              <Share2 className="h-4 w-4 mr-1" />
                              <span className="text-sm">Share</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${platform}-title`}>Title/Caption</Label>
                      <Input 
                        id={`${platform}-title`} 
                        value={shareTitle}
                        onChange={(e) => setShareTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`${platform}-description`}>Description</Label>
                      <Textarea 
                        id={`${platform}-description`} 
                        value={shareDescription}
                        onChange={(e) => setShareDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id={`${platform}-hashtags`}
                          checked={enableHashtags}
                          onCheckedChange={setEnableHashtags}
                        />
                        <Label htmlFor={`${platform}-hashtags`}>Auto-generate hashtags</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id={`${platform}-cta`}
                          checked={enableCTA}
                          onCheckedChange={setEnableCTA}
                        />
                        <Label htmlFor={`${platform}-cta`}>Include call-to-action</Label>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center"
                      onClick={handleCopyText}
                    >
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied to clipboard!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy text for {platformStyles[platform as keyof typeof platformStyles].name}
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm text-muted-foreground">
                Customize your messaging for each platform to maximize engagement. When your video is ready, 
                it will be shared directly to these platforms with your customized captions and descriptions.
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}