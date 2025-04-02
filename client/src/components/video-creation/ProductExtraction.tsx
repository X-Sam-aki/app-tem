import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productUrlSchema, type ProductUrlInput } from '@shared/schema';
import { X, Loader2, Info, ExternalLink } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { supabaseEdgeFunctions } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductExtractionProps {
  onExtractComplete: (productData: any) => void;
}

const ProductExtraction = ({ onExtractComplete }: ProductExtractionProps) => {
  const [extractedProduct, setExtractedProduct] = useState<any | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProductUrlInput>({
    resolver: zodResolver(productUrlSchema),
    defaultValues: {
      url: ''
    }
  });
  
  const formatMetadata = (metadata: any) => {
    if (!metadata) return [];
    
    const formattedData = [];
    
    for (const [key, value] of Object.entries(metadata)) {
      formattedData.push({
        key: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: typeof value === 'object' ? JSON.stringify(value) : String(value)
      });
    }
    
    return formattedData;
  };

  const extractMutation = useMutation({
    mutationFn: async (url: string) => {
      const { data, error } = await supabaseEdgeFunctions.extractProduct(url);
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setExtractedProduct(data);
      onExtractComplete(data);
      setIsProductDialogOpen(true);
      toast.success('Product data extracted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to extract product: ${error.message}`);
    }
  });

  const onSubmit = (data: ProductUrlInput) => {
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
            <Label htmlFor="product-url">Product URL</Label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <Input
                id="product-url"
                placeholder="https://www.example.com/product/..."
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
            <p className="mt-2 text-sm text-slate-500">
              Paste a valid product URL from supported platforms (Temu, Amazon). 
              Examples: 
              <br />- Temu: https://www.temu.com/subject/n9/googleshopping-landingpage-a-psurl.html?goods_id=601099511975028
              <br />- Amazon: https://www.amazon.com/dp/B08N5LNQCX
            </p>
          </div>
        </form>
        
        {extractedProduct && (
          <>
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
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2 h-6 p-0 text-slate-500"
                        onClick={() => setIsProductDialogOpen(true)}
                      >
                        <Info className="h-4 w-4 mr-1" />
                        <span>View Details</span>
                      </Button>
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

            {/* Product Details Dialog */}
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>Product Details</DialogTitle>
                  <DialogDescription>
                    Complete information extracted from the product page
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="overview" className="flex-1 overflow-hidden flex flex-col">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                    <TabsTrigger value="details">Product Details</TabsTrigger>
                    <TabsTrigger value="metadata">Raw Data</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="flex-1 overflow-hidden flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-auto">
                      <div>
                        {extractedProduct.images && extractedProduct.images.length > 0 ? (
                          <div className="aspect-square bg-slate-100 rounded-md overflow-hidden">
                            <img 
                              src={extractedProduct.images[0]} 
                              alt={extractedProduct.title} 
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="aspect-square bg-slate-100 rounded-md flex items-center justify-center">
                            <span className="text-slate-400">No image available</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-xl">{extractedProduct.title}</h3>
                          <div className="flex items-center mt-2">
                            <Badge variant="outline" className="mr-2 capitalize">
                              {extractedProduct.platformName || 'Unknown Platform'}
                            </Badge>
                            <span className="text-2xl font-bold text-slate-900">{extractedProduct.price}</span>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h4 className="font-medium mb-2">Description</h4>
                          <p className="text-slate-600">{extractedProduct.description || "No description available"}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Product Link</h4>
                          <a 
                            href={extractedProduct.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <span>View on {extractedProduct.platformName ? extractedProduct.platformName.charAt(0).toUpperCase() + extractedProduct.platformName.slice(1) : 'Platform'}</span>
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        </div>
                        
                        {extractedProduct.platformId && (
                          <div>
                            <h4 className="font-medium mb-2">Platform ID</h4>
                            <code className="bg-slate-100 px-2 py-1 rounded">{extractedProduct.platformId}</code>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="images" className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[400px]">
                      {extractedProduct.images && extractedProduct.images.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {extractedProduct.images.map((image: string, index: number) => (
                            <div key={index} className="aspect-square bg-slate-100 rounded-md overflow-hidden">
                              <img 
                                src={image} 
                                alt={`${extractedProduct.title} - Image ${index + 1}`} 
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-slate-400">No images available</span>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="details" className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {extractedProduct.metadata && extractedProduct.metadata.productDetails && (
                          <div>
                            <h3 className="font-medium text-lg mb-2">Product Specifications</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {Object.entries(extractedProduct.metadata.productDetails).map(([key, value]: [string, any]) => (
                                <div key={key} className="flex">
                                  <span className="font-medium min-w-[120px] text-slate-700">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                  </span>
                                  <span className="text-slate-600 ml-2">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {extractedProduct.metadata && extractedProduct.metadata.features && (
                          <div>
                            <h3 className="font-medium text-lg mb-2">Features</h3>
                            <ul className="list-disc list-inside space-y-1">
                              {extractedProduct.metadata.features.map((feature: string, index: number) => (
                                <li key={index} className="text-slate-600">{feature}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {(!extractedProduct.metadata || 
                          (!extractedProduct.metadata.productDetails && !extractedProduct.metadata.features)) && (
                          <div className="flex items-center justify-center h-40">
                            <span className="text-slate-400">No detailed product information available</span>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="metadata" className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-md">
                          <h3 className="font-medium text-lg mb-2">All Extracted Data</h3>
                          <div className="grid grid-cols-1 gap-2">
                            {formatMetadata(extractedProduct).map((item, index) => (
                              <div key={index} className="flex border-b border-slate-100 py-1 last:border-0">
                                <span className="font-medium min-w-[180px] text-slate-700">{item.key}:</span>
                                <span className="text-slate-600 ml-2 break-all">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductExtraction;
