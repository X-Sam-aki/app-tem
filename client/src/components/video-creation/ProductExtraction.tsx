import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { temuUrlSchema, type TemuUrlInput } from '@shared/schema';
import { X, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { supabaseEdgeFunctions } from '@/lib/supabase';
import { toast } from 'sonner';

interface ProductExtractionProps {
  onExtractComplete: (productData: any) => void;
}

const ProductExtraction = ({ onExtractComplete }: ProductExtractionProps) => {
  const [extractedProduct, setExtractedProduct] = useState<any | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<TemuUrlInput>({
    resolver: zodResolver(temuUrlSchema),
    defaultValues: {
      url: ''
    }
  });

  const extractMutation = useMutation({
    mutationFn: async (url: string) => {
      const { data, error } = await supabaseEdgeFunctions.extractProduct(url);
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setExtractedProduct(data);
      onExtractComplete(data);
      toast.success('Product data extracted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to extract product: ${error.message}`);
    }
  });

  const onSubmit = (data: TemuUrlInput) => {
    extractMutation.mutate(data.url);
  };

  const removeProduct = () => {
    setExtractedProduct(null);
    onExtractComplete(null);
  };

  return (
    <div className="mb-6">
      <h3 className="text-base font-medium text-slate-900 mb-4">Step 1: Add Product URL</h3>
      <div className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="product-url">Temu Product URL</Label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <Input
                id="product-url"
                placeholder="https://www.temu.com/product/..."
                className="flex-1"
                {...register('url')}
                error={!!errors.url}
              />
              <Button 
                type="submit" 
                className="ml-3" 
                disabled={extractMutation.isPending}
              >
                {extractMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Extracting...
                  </>
                ) : 'Extract'}
              </Button>
            </div>
            {errors.url && (
              <p className="mt-1 text-sm text-red-500">{errors.url.message}</p>
            )}
            <p className="mt-2 text-sm text-slate-500">Paste a valid Temu product URL to extract product information.</p>
          </div>
        </form>
        
        {extractedProduct && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-16 w-16 bg-slate-200 rounded overflow-hidden">
                  {extractedProduct.images && extractedProduct.images.length > 0 ? (
                    <img 
                      src={extractedProduct.images[0]} 
                      alt={extractedProduct.title} 
                      className="h-16 w-16 object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 flex items-center justify-center text-slate-400">No image</div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-sm font-medium text-slate-900">{extractedProduct.title}</h4>
                  <p className="mt-1 text-sm text-slate-500">{extractedProduct.price}</p>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-green-600 font-medium">Product extracted successfully</span>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="ml-4 text-slate-400 hover:text-slate-500"
                  onClick={removeProduct}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductExtraction;
