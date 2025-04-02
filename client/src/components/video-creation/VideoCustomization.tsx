import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import VideoPreview from './VideoPreview';
import { useMutation } from '@tanstack/react-query';
import { cloudinaryService } from '@/lib/cloudinary';
import { toast } from 'sonner';

interface VideoCustomizationProps {
  productData: any;
  onCustomizationComplete: (customizationData: any) => void;
}

const VideoCustomization = ({ productData, onCustomizationComplete }: VideoCustomizationProps) => {
  const [template, setTemplate] = useState('flash-deal');
  const [backgroundMusic, setBackgroundMusic] = useState('upbeat');
  const [title, setTitle] = useState(productData?.title || '');
  const [textColor, setTextColor] = useState('#2563eb'); // Primary blue
  const [showCta, setShowCta] = useState(true);
  const [ctaText, setCtaText] = useState('Get it now!');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Update title when product data changes
  useEffect(() => {
    if (productData?.title) {
      setTitle(productData.title);
    }
  }, [productData]);

  const generatePreviewMutation = useMutation({
    mutationFn: async () => {
      if (!productData || !productData.images || productData.images.length === 0) {
        throw new Error('No product data or images available');
      }

      const renderOptions = {
        productImages: productData.images,
        template,
        textColor,
        ctaText: showCta ? ctaText : undefined,
        backgroundMusic,
        title,
      };

      return await cloudinaryService.renderVideoPreview(renderOptions);
    },
    onSuccess: (url) => {
      setPreviewUrl(url);
      onCustomizationComplete({
        template,
        backgroundMusic,
        title,
        textColor,
        showCta,
        ctaText,
        previewUrl: url,
      });
      toast.success('Preview generated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate preview: ${error.message}`);
    },
  });

  const handleGeneratePreview = () => {
    generatePreviewMutation.mutate();
  };

  const colorOptions = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Black', value: '#1e293b' },
    { name: 'White', value: '#ffffff' },
  ];

  return (
    <div className="border-t border-slate-200 pt-6 mb-6">
      <h3 className="text-base font-medium text-slate-900 mb-4">Step 2: Customize Your Video</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <Label htmlFor="template">Template Style</Label>
            <Select 
              value={template} 
              onValueChange={setTemplate}
            >
              <SelectTrigger id="template">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flash-deal">Flash Deal</SelectItem>
                <SelectItem value="product-showcase">Product Showcase</SelectItem>
                <SelectItem value="feature-highlight">Feature Highlight</SelectItem>
                <SelectItem value="comparison">Comparison</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="background-music">Background Music</Label>
            <Select
              value={backgroundMusic}
              onValueChange={setBackgroundMusic}
            >
              <SelectTrigger id="background-music">
                <SelectValue placeholder="Select music style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upbeat">Upbeat</SelectItem>
                <SelectItem value="relaxed">Relaxed</SelectItem>
                <SelectItem value="electronic">Electronic</SelectItem>
                <SelectItem value="acoustic">Acoustic</SelectItem>
                <SelectItem value="none">No Music</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="video-title">Video Title</Label>
            <Input
              id="video-title"
              placeholder="Enter a catchy title for your video"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <Label>Text Color</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 ${
                    textColor === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
                  }`}
                  style={{ backgroundColor: color.value, border: color.value === '#ffffff' ? '1px solid #e2e8f0' : 'none' }}
                  onClick={() => setTextColor(color.value)}
                  aria-label={`Select ${color.name} color`}
                />
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="cta-switch">Add Call-to-Action</Label>
              <Switch
                id="cta-switch"
                checked={showCta}
                onCheckedChange={setShowCta}
              />
            </div>
            {showCta && (
              <Input
                className="mt-2"
                placeholder="Enter CTA text (e.g., 'Shop Now')"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
              />
            )}
          </div>
        </div>
        
        <div className="md:col-span-1">
          <VideoPreview 
            previewUrl={previewUrl} 
            isPending={generatePreviewMutation.isPending}
            onGeneratePreview={handleGeneratePreview}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoCustomization;
