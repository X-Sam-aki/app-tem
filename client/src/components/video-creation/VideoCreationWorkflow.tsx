import { useState } from 'react';
import { useProgress } from '@/hooks/use-progress';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import ProductExtraction from './ProductExtraction';
import VideoCustomization from './VideoCustomization';
import VideoPublishing from './VideoPublishing';
import { PremiumFeatures } from './PremiumFeatures';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

const VideoCreationWorkflow = () => {
  const { currentStep, nextStep, prevStep } = useProgress();
  const [extractedProduct, setExtractedProduct] = useState<any | null>(null);
  const [customizationData, setCustomizationData] = useState<any | null>(null);
  const [publishingData, setPublishingData] = useState<any | null>(null);
  
  const saveProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const response = await apiRequest('POST', '/api/products', productData);
      return await response.json();
    },
    onSuccess: (data) => {
      setExtractedProduct({...extractedProduct, id: data.id});
    },
    onError: (error: Error) => {
      toast.error(`Error saving product: ${error.message}`);
    }
  });

  const handleProductExtraction = (productData: any) => {
    setExtractedProduct(productData);
    
    if (productData) {
      // Save the product to our database
      saveProductMutation.mutate(productData);
    }
  };

  const handleCustomizationComplete = (customizationData: any) => {
    setCustomizationData(customizationData);
  };

  const handlePublishingComplete = (publishingData: any) => {
    setPublishingData(publishingData);
    toast.success('Video creation workflow completed successfully!');
  };

  const handleNext = () => {
    if (currentStep === 0 && !extractedProduct) {
      toast.error('Please extract a product first');
      return;
    }
    
    if (currentStep === 1 && !customizationData) {
      toast.error('Please customize your video and generate a preview');
      return;
    }
    
    nextStep();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProductExtraction onExtractComplete={handleProductExtraction} />
        );
      case 1:
        return (
          <VideoCustomization 
            productData={extractedProduct} 
            onCustomizationComplete={handleCustomizationComplete} 
          />
        );
      case 2:
        return (
          <VideoPublishing 
            productData={extractedProduct}
            customizationData={customizationData}
            onPublishingComplete={handlePublishingComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-5">
          {renderStepContent()}
          
          <div className="flex justify-between mt-6 border-t border-slate-200 pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            {currentStep < 2 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
      
      {/* Premium Features Section */}
      <div className="mt-8">
        <div className="flex items-center mb-4">
          <Sparkles className="mr-2 h-5 w-5 text-amber-500" />
          <h2 className="text-xl font-semibold">Premium Features</h2>
        </div>
        <PremiumFeatures />
      </div>
    </div>
  );
};

export default VideoCreationWorkflow;
