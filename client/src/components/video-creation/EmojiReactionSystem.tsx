import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Heart, 
  ThumbsUp, 
  Smile, 
  PartyPopper, 
  Laugh, 
  AlertTriangle, 
  Flame, 
  Clock, 
  ChevronDown,
  ChevronUp,
  Crown
} from "lucide-react";

type Emoji = {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: string;
};

const emojis: Emoji[] = [
  { id: 'heart', icon: <Heart className="h-5 w-5" />, label: 'Heart', color: 'text-red-500' },
  { id: 'thumbsup', icon: <ThumbsUp className="h-5 w-5" />, label: 'Thumbs Up', color: 'text-blue-500' },
  { id: 'smile', icon: <Smile className="h-5 w-5" />, label: 'Smile', color: 'text-yellow-500' },
  { id: 'party', icon: <PartyPopper className="h-5 w-5" />, label: 'Party', color: 'text-purple-500' },
  { id: 'laugh', icon: <Laugh className="h-5 w-5" />, label: 'Laugh', color: 'text-green-500' },
  { id: 'angry', icon: <AlertTriangle className="h-5 w-5" />, label: 'Alert', color: 'text-orange-500' },
  { id: 'fire', icon: <Flame className="h-5 w-5" />, label: 'Fire', color: 'text-amber-500' },
];

type EmojiReactionSystemProps = {
  isPremium: boolean;
};

export function EmojiReactionSystem({ isPremium = false }: EmojiReactionSystemProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>(['heart', 'thumbsup', 'smile']);
  const [position, setPosition] = useState<string>("bottom-right");
  const [timing, setTiming] = useState<number[]>([50]);
  const [size, setSize] = useState<number[]>([50]);
  const [enablePulsing, setEnablePulsing] = useState(true);
  const [enableRandomization, setEnableRandomization] = useState(false);

  const toggleEmoji = (emojiId: string) => {
    if (selectedEmojis.includes(emojiId)) {
      setSelectedEmojis(selectedEmojis.filter(id => id !== emojiId));
    } else if (selectedEmojis.length < 3 || !isPremium) {
      setSelectedEmojis([...selectedEmojis, emojiId]);
    }
  };

  return (
    <Card className="w-full mb-6 border-muted-foreground/20">
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2">💬</span> Emoji Reaction System
            {!isPremium && <span className="ml-2 text-xs bg-amber-600/20 text-amber-500 px-2 py-0.5 rounded-full">Premium</span>}
          </CardTitle>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        <CardDescription>
          Add engaging emoji reactions to highlight product features
        </CardDescription>
      </CardHeader>
      
      {expanded && (
        <CardContent className={`${!isPremium ? 'opacity-70 pointer-events-none' : ''}`}>
          {!isPremium && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-b-lg">
              <Button 
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
                onClick={() => window.location.href = '/premium-features'}
              >
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Button>
            </div>
          )}
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Select Emoji Reactions (up to 3)</Label>
              <div className="flex flex-wrap gap-2">
                {emojis.map((emoji) => (
                  <Button
                    key={emoji.id}
                    variant={selectedEmojis.includes(emoji.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleEmoji(emoji.id)}
                    className="flex items-center gap-1"
                  >
                    <span className={emoji.color}>{emoji.icon}</span>
                    {emoji.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Position</Label>
              <RadioGroup defaultValue={position} onValueChange={setPosition} className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="top-left" id="top-left" />
                  <Label htmlFor="top-left">Top Left</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="top-right" id="top-right" />
                  <Label htmlFor="top-right">Top Right</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bottom-left" id="bottom-left" />
                  <Label htmlFor="bottom-left">Bottom Left</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bottom-right" id="bottom-right" />
                  <Label htmlFor="bottom-right">Bottom Right</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Appearance Timing</Label>
                <span className="text-sm text-muted-foreground">{timing[0]}%</span>
              </div>
              <Slider
                defaultValue={timing}
                max={100}
                step={5}
                onValueChange={setTiming}
              />
              <p className="text-xs text-muted-foreground">When the emoji reaction appears in the video timeline</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Size</Label>
                <span className="text-sm text-muted-foreground">{size[0]}%</span>
              </div>
              <Slider
                defaultValue={size}
                max={100}
                step={5}
                onValueChange={setSize}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="pulsing" 
                checked={enablePulsing}
                onCheckedChange={setEnablePulsing}
              />
              <Label htmlFor="pulsing">Enable pulsing animation</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="randomize" 
                checked={enableRandomization}
                onCheckedChange={setEnableRandomization}
              />
              <Label htmlFor="randomize">Randomize appearance order</Label>
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Emoji reactions appear based on your timing settings and help highlight key product features</p>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}