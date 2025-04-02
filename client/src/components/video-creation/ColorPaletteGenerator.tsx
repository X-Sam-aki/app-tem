import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, RefreshCw, Download, Copy, Check, Palette } from "lucide-react";

type ColorPaletteGeneratorProps = {
  isPremium: boolean;
};

export function ColorPaletteGenerator({ isPremium = false }: ColorPaletteGeneratorProps) {
  const [expanded, setExpanded] = useState(false);
  const [colorCount, setColorCount] = useState<number[]>([5]);
  const [paletteType, setPaletteType] = useState("complementary");
  const [enableAutoExtract, setEnableAutoExtract] = useState(true);
  const [enableAccessibility, setEnableAccessibility] = useState(true);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  
  // Demo palette colors
  const demoPalettes = {
    complementary: ["#3b82f6", "#f97316", "#10b981", "#8b5cf6", "#f43f5e"],
    monochromatic: ["#0f172a", "#1e293b", "#334155", "#64748b", "#94a3b8"],
    analogous: ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"],
    triadic: ["#3b82f6", "#f97316", "#10b981", "#8b5cf6", "#f43f5e"],
    custom: ["#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8"]
  };
  
  const generatePalette = () => {
    // This would typically fetch from an API or run an algorithm
    // For now, we're just returning the demo palette
    return demoPalettes[paletteType as keyof typeof demoPalettes];
  };
  
  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };
  
  const downloadPalette = () => {
    const colors = generatePalette();
    const fileName = `shortify-palette-${new Date().getTime()}.json`;
    const json = JSON.stringify({ palette: colors, type: paletteType }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full mb-6 border-muted-foreground/20">
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2">🎨</span> AI-Powered Thumbnail Color Palette Generator
            {!isPremium && <span className="ml-2 text-xs bg-amber-600/20 text-amber-500 px-2 py-0.5 rounded-full">Premium</span>}
          </CardTitle>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        <CardDescription>
          Generate eye-catching color palettes for video thumbnails to improve click-through rates
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
              <div className="flex flex-wrap gap-3">
                {generatePalette().map((color, index) => (
                  <div key={index} className="space-y-1">
                    <div 
                      className="w-16 h-16 rounded-md cursor-pointer relative group"
                      style={{ backgroundColor: color }}
                      onClick={() => handleCopyColor(color)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-md transition-opacity">
                        {copiedColor === color ? (
                          <Check className="h-6 w-6 text-white" />
                        ) : (
                          <Copy className="h-5 w-5 text-white" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs font-mono text-center">{color}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex gap-1 items-center"
                  onClick={() => {
                    // This would re-run the palette generation
                    setPaletteType(paletteType);
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex gap-1 items-center"
                  onClick={downloadPalette}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Palette Type</Label>
                    <Select value={paletteType} onValueChange={setPaletteType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select palette type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="complementary">Complementary</SelectItem>
                        <SelectItem value="monochromatic">Monochromatic</SelectItem>
                        <SelectItem value="analogous">Analogous</SelectItem>
                        <SelectItem value="triadic">Triadic</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Number of Colors</Label>
                      <span className="text-sm text-muted-foreground">{colorCount[0]}</span>
                    </div>
                    <Slider 
                      value={colorCount}
                      min={3}
                      max={7}
                      step={1}
                      onValueChange={setColorCount}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="auto-extract" 
                      checked={enableAutoExtract}
                      onCheckedChange={setEnableAutoExtract}
                    />
                    <Label htmlFor="auto-extract">Auto-extract from product images</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="accessibility" 
                      checked={enableAccessibility}
                      onCheckedChange={setEnableAccessibility}
                    />
                    <Label htmlFor="accessibility">Ensure accessibility compliance</Label>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        AI-generated color palettes can increase thumbnail click-through rates by up to 40%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary p-4 rounded-md">
              <h4 className="font-medium mb-2">How It Works</h4>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes your product images and video content to generate optimized color palettes
                that stand out in social media feeds. These colors are automatically applied to your video 
                thumbnails, text overlays, and call-to-action buttons to create a cohesive and eye-catching 
                visual identity.
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}