import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { youtubeAPIService } from '@/lib/youtube-api';
import { cloudinaryService } from '@/lib/cloudinary';
import { apiRequest } from '@/lib/queryClient';
import { toast } from 'sonner';

interface VideoPublishingProps {
  productData: any;
  customizationData: any;
  onPublishingComplete: (publishingData: any) => void;
}

const VideoPublishing = ({ productData, customizationData, onPublishingComplete }: VideoPublishingProps) => {
  const [isYouTubeConnected, setIsYouTubeConnected] = useState(false);
  const [youtubeMetadata, setYoutubeMetadata] = useState({
    title: customizationData?.title || productData?.title || '',
    description: `Check out this amazing product! Perfect for anyone looking for quality at an affordable price. Use my affiliate link below to get an extra 10% off!\n\n#affiliate #deals #temu`,
    tags: 'affiliate, deals, temu, budget',
    privacyStatus: 'public' as 'public' | 'unlisted' | 'private',
  });

  const connectYouTubeMutation = useMutation({
    mutationFn: async () => {
      return await youtubeAPIService.authenticate();
    },
    onSuccess: () => {
      setIsYouTubeConnected(true);
      toast.success('YouTube account connected successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to connect YouTube account: ${error.message}`);
    },
  });

  const renderVideoMutation = useMutation({
    mutationFn: async () => {
      if (!productData || !customizationData) {
        throw new Error('Missing product or customization data');
      }

      const renderOptions = {
        productImages: productData.images,
        template: customizationData.template,
        textColor: customizationData.textColor,
        ctaText: customizationData.showCta ? customizationData.ctaText : undefined,
        backgroundMusic: customizationData.backgroundMusic,
        title: customizationData.title,
      };

      return await cloudinaryService.renderFinalVideo(renderOptions);
    },
    onSuccess: (videoUrl) => {
      publishToYouTubeMutation.mutate(videoUrl);
    },
    onError: (error: Error) => {
      toast.error(`Failed to render video: ${error.message}`);
    },
  });

  const publishToYouTubeMutation = useMutation({
    mutationFn: async (videoUrl: string) => {
      if (!isYouTubeConnected) {
        throw new Error('YouTube account not connected');
      }

      const { title, description, tags, privacyStatus } = youtubeMetadata;

      const metadata = {
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim()),
        privacyStatus,
      };

      const youtubeVideoId = await youtubeAPIService.uploadVideo(videoUrl, metadata);

      // Save video in our database
      const videoData = {
        productId: productData.id,
        title: metadata.title,
        description: metadata.description,
        templateId: customizationData.template,
        videoUrl,
        youtubeVideoId,
        status: 'published',
        metadata: {
          ...customizationData,
          youtubeMetadata: metadata,
        },
      };

      await apiRequest('POST', '/api/videos', videoData);

      return { videoUrl, youtubeVideoId };
    },
    onSuccess: (data) => {
      onPublishingComplete(data);
      toast.success('Video published to YouTube successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to publish to YouTube: ${error.message}`);
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      if (!productData || !customizationData) {
        throw new Error('Missing product or customization data');
      }

      const draftData = {
        productId: productData.id,
        title: youtubeMetadata.title,
        description: youtubeMetadata.description,
        templateId: customizationData.template,
        status: 'draft',
        metadata: {
          ...customizationData,
          youtubeMetadata,
        },
      };

      const response = await apiRequest('POST', '/api/videos', draftData);
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Draft saved successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save draft: ${error.message}`);
    },
  });

  const handleConnectYouTube = () => {
    connectYouTubeMutation.mutate();
  };

  const handlePublish = () => {
    if (!isYouTubeConnected) {
      toast.error('Please connect your YouTube account first');
      return;
    }
    renderVideoMutation.mutate();
  };

  const handleSaveDraft = () => {
    saveDraftMutation.mutate();
  };

  const isPending = 
    connectYouTubeMutation.isPending || 
    renderVideoMutation.isPending || 
    publishToYouTubeMutation.isPending ||
    saveDraftMutation.isPending;

  return (
    <div className="border-t border-slate-200 pt-6">
      <h3 className="text-base font-medium text-slate-900 mb-4">Step 3: Publish to YouTube</h3>
      
      {!isYouTubeConnected && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <AlertTitle>YouTube Connection Required</AlertTitle>
          <AlertDescription className="mt-1">
            You need to connect your YouTube account before publishing.
            <Button 
              variant="link" 
              className="p-0 h-auto font-medium underline text-yellow-700 hover:text-yellow-600 ml-1"
              onClick={handleConnectYouTube}
              disabled={connectYouTubeMutation.isPending}
            >
              {connectYouTubeMutation.isPending ? 'Connecting...' : 'Connect now'}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="youtube-title">YouTube Title</Label>
          <Input
            id="youtube-title"
            placeholder="Enter title for YouTube"
            value={youtubeMetadata.title}
            onChange={(e) => setYoutubeMetadata({...youtubeMetadata, title: e.target.value})}
          />
        </div>
        
        <div>
          <Label htmlFor="youtube-description">Description</Label>
          <Textarea
            id="youtube-description"
            placeholder="Enter description for YouTube"
            rows={3}
            value={youtubeMetadata.description}
            onChange={(e) => setYoutubeMetadata({...youtubeMetadata, description: e.target.value})}
          />
        </div>
        
        <div>
          <Label htmlFor="youtube-tags">Tags (comma separated)</Label>
          <Input
            id="youtube-tags"
            placeholder="e.g., wireless earbuds, budget, temu"
            value={youtubeMetadata.tags}
            onChange={(e) => setYoutubeMetadata({...youtubeMetadata, tags: e.target.value})}
          />
        </div>
        
        <div>
          <Label>Visibility</Label>
          <RadioGroup 
            value={youtubeMetadata.privacyStatus}
            onValueChange={(value) => setYoutubeMetadata({
              ...youtubeMetadata, 
              privacyStatus: value as 'public' | 'unlisted' | 'private'
            })}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="visibility-public" />
              <Label htmlFor="visibility-public" className="cursor-pointer">Public</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unlisted" id="visibility-unlisted" />
              <Label htmlFor="visibility-unlisted" className="cursor-pointer">Unlisted</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="visibility-private" />
              <Label htmlFor="visibility-private" className="cursor-pointer">Private</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="pt-2 flex flex-wrap gap-3">
          <Button
            onClick={handlePublish}
            disabled={!isYouTubeConnected || isPending}
          >
            {(renderVideoMutation.isPending || publishToYouTubeMutation.isPending) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {renderVideoMutation.isPending ? 'Rendering...' : 'Publishing...'}
              </>
            ) : 'Publish to YouTube'}
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isPending}
          >
            {saveDraftMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save as Draft'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPublishing;
