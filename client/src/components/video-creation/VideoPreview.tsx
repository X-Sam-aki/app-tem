import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Play } from 'lucide-react';

interface VideoPreviewProps {
  previewUrl: string | null;
  isPending: boolean;
  onGeneratePreview: () => void;
}

const VideoPreview = ({ previewUrl, isPending, onGeneratePreview }: VideoPreviewProps) => {
  return (
    <div className="bg-slate-100 rounded-lg p-4 h-full">
      <h4 className="text-sm font-medium text-slate-700 mb-2">Video Preview</h4>
      <div className="bg-black aspect-[9/16] rounded-md overflow-hidden relative">
        {previewUrl ? (
          <video 
            src={previewUrl} 
            className="h-full w-full object-contain" 
            controls 
            loop
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <Play className="h-12 w-12 mx-auto text-slate-300" />
              <p className="mt-2 text-xs text-slate-300">Preview will generate<br/>after customization</p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3">
        <Button 
          onClick={onGeneratePreview} 
          className="w-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : 'Generate Preview'}
        </Button>
      </div>
    </div>
  );
};

export default VideoPreview;
