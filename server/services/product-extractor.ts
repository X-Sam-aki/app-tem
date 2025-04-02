import { extractTemuProduct } from './temu-extractor';
import { extractAmazonProduct } from './amazon-extractor';
import { extractWalmartProduct } from './walmart-extractor';

export interface Product {
  title: string;
  description: string;
  price: string;
  images: string[];
  platformId: string;
  platformName: string;
  url: string;
  metadata: {
    rating?: number;
    reviewCount?: number;
    productDetails?: Record<string, string>;
    features?: string[];
    [key: string]: any;
  };
}

// Premium feature flag for multi-platform support
const ENABLE_MULTIPLATFORM = true; // This would be controlled by user subscription in production

export async function extractProduct(url: string): Promise<Product> {
  // Basic URL validation
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid URL provided');
  }
  
  try {
    // Normalize URL - ensure it has http/https prefix
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Parse hostname from URL to determine platform
    const hostname = new URL(url).hostname;
    
    // Determine which extractor to use based on the URL
    if (hostname.includes('temu.com')) {
      console.log('Using Temu extractor for URL:', url);
      return await extractTemuProduct(url);
    } 
    else if (hostname.includes('amazon.com') && ENABLE_MULTIPLATFORM) {
      console.log('Using Amazon extractor for URL:', url);
      return await extractAmazonProduct(url);
    }
    else if (hostname.includes('walmart.com') && ENABLE_MULTIPLATFORM) {
      console.log('Using Walmart extractor for URL:', url);
      return await extractWalmartProduct(url);
    }
    else if (ENABLE_MULTIPLATFORM) {
      // Could add more extractors for other platforms here
      throw new Error('Unsupported platform. Currently supporting Temu, Amazon, and Walmart product URLs.');
    }
    else {
      // Non-premium users only get Temu support
      throw new Error('Multi-platform product extraction is a premium feature. Currently only supporting Temu product URLs for your account.');
    }
  } catch (error) {
    if (error instanceof Error) {
      // Rethrow with more context
      throw new Error(`Product extraction failed: ${error.message}`);
    }
    throw error;
  }
}