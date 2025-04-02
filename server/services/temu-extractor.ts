import axios from 'axios';
import * as cheerio from 'cheerio';

interface TemuProduct {
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

export async function extractTemuProduct(url: string): Promise<TemuProduct> {
  try {
    // Check if it's a valid Temu URL
    if (!url.includes('temu.com')) {
      throw new Error('Invalid Temu URL');
    }

    // Attempt to extract product ID from URL
    let productId = '';
    const goodsIdMatch = url.match(/goods_id=([0-9]+)/);
    if (goodsIdMatch && goodsIdMatch[1]) {
      productId = goodsIdMatch[1];
    } else {
      // Alternative extraction for different URL formats
      const urlPathParts = url.split('/');
      const lastPart = urlPathParts[urlPathParts.length - 1];
      if (/^\d+$/.test(lastPart)) {
        productId = lastPart;
      }
    }
    
    // If we have a product ID, try to use Temu's API directly
    if (productId) {
      try {
        // Try the product API first - this might be blocked but worth trying
        const apiUrl = `https://www.temu.com/api/atlas/product/detail?goods_id=${productId}`;
        const response = await axios.get(apiUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.5',
            'Referer': 'https://www.temu.com/',
          },
          timeout: 5000,
        });
        
        // If we got API data, use it instead of scraping HTML
        if (response.data && response.data.data) {
          const productData = response.data.data;
          return {
            title: productData.goods_name || 'Temu Product',
            description: productData.goods_desc || 'No description available',
            price: productData.price?.price_display || '$0.00',
            images: (productData.gallery || []).map((img: any) => img.url),
            platformId: productId,
            platformName: 'temu',
            url,
            metadata: {
              rating: productData.review?.average || 4.5,
              reviewCount: productData.review?.count || 0,
              productDetails: productData.specifications?.reduce((acc: Record<string, string>, spec: any) => {
                if (spec.name && spec.value) {
                  acc[spec.name] = spec.value;
                }
                return acc;
              }, {}),
              features: productData.selling_points || []
            }
          };
        }
      } catch (error) {
        console.log('API fetch attempt failed, falling back to HTML scraping', error);
        // Continue to HTML scraping as fallback
      }
    }
    
    // Fallback to HTML page scraping
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.temu.com/',
      },
      timeout: 10000, // 10 seconds timeout
    });

    // Load the HTML content
    const $ = cheerio.load(response.data);
    
    // Extract title with multiple selectors
    let title = '';
    const titleSelectors = ['h1.title', '._3-q1y', '.product-title', '.item-title', '.goods-name', '.product-name h1'];
    for (const selector of titleSelectors) {
      const text = $(selector).text().trim();
      if (text) {
        title = text;
        break;
      }
    }
    
    // Try to extract from structured data if selectors didn't work
    if (!title) {
      try {
        const structuredData = $('script[type="application/ld+json"]').html();
        if (structuredData) {
          const jsonData = JSON.parse(structuredData);
          if (jsonData.name) {
            title = jsonData.name;
          }
        }
      } catch (e) {
        console.error('Error parsing structured data:', e);
      }
    }
    
    // Extract description with multiple selectors
    let description = '';
    const descriptionSelectors = ['._3CRkq', '.product-detail-description', '.product-description', '.goods-description'];
    for (const selector of descriptionSelectors) {
      const text = $(selector).text().trim();
      if (text) {
        description = text;
        break;
      }
    }
    
    // Extract price with multiple selectors
    let price = '';
    const priceSelectors = ['._2yjN1', '.price-current', '._25Uo9', '.price', '.product-price', '.goods-price'];
    for (const selector of priceSelectors) {
      const text = $(selector).text().trim();
      if (text) {
        price = text;
        break;
      }
    }
    
    // Try to extract price from structured data if selectors didn't work
    if (!price) {
      try {
        const structuredData = $('script[type="application/ld+json"]').html();
        if (structuredData) {
          const jsonData = JSON.parse(structuredData);
          if (jsonData.offers && jsonData.offers.price) {
            price = '$' + jsonData.offers.price;
          }
        }
      } catch (e) {
        console.error('Error parsing structured data for price:', e);
      }
    }
    
    // Extract images
    const images: string[] = [];
    $('._3Vf1T img, .product-image img').each((_i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && !src.includes('data:image')) {
        images.push(src);
      }
    });

    // If we couldn't find images through regular selectors, try looking for JSON data in scripts
    if (images.length === 0) {
      const scriptContent = $('script:contains("window.__PRELOADED_STATE__")').html() || '';
      // Use non-dotall regex compatibility for older JS versions
      const jsonMatch = scriptContent.match(/window\.__PRELOADED_STATE__\s*=\s*({[\s\S]*?});/);
      
      if (jsonMatch && jsonMatch[1]) {
        try {
          const data = JSON.parse(jsonMatch[1]);
          const imageData = data?.entities?.goods?.detail?.images || [];
          
          if (Array.isArray(imageData)) {
            imageData.forEach((img: any) => {
              if (img?.url) {
                images.push(img.url);
              }
            });
          }
        } catch (e) {
          console.error('Error parsing JSON from script:', e);
        }
      }
    }

    // Extract platformId from URL if not already set
    const extractedPlatformId = productId || url.split('/').pop()?.split('?')[0] || 'unknown';

    // Try to extract product details
    const productDetails: Record<string, string> = {};
    $('._3tzGu li, .specifications li').each((_i, el) => {
      const text = $(el).text().trim();
      const [key, value] = text.split(':').map(part => part.trim());
      
      if (key && value) {
        productDetails[key] = value;
      }
    });

    // Try to extract features
    const features: string[] = [];
    $('._3J0j5 li, .features li').each((_i, el) => {
      const text = $(el).text().trim();
      if (text) {
        features.push(text);
      }
    });

    // Try to extract rating and review count
    let rating: number | undefined;
    let reviewCount: number | undefined;
    
    const ratingText = $('._2oUd9 .rating-average, .rating').text().trim();
    const reviewCountText = $('._2oUd9 .rating-count, .review-count').text().trim();
    
    if (ratingText) {
      rating = parseFloat(ratingText);
    }
    
    if (reviewCountText) {
      const match = reviewCountText.match(/\d+/);
      if (match) {
        reviewCount = parseInt(match[0], 10);
      }
    }

    // If we couldn't extract enough data, return fallback
    if (!title || images.length === 0) {
      // Fall back to sample data for development if we couldn't extract real data
      return {
        title: "Sample Temu Product (Extraction Failed)",
        description: "This is a sample product because we couldn't extract the real data from Temu. The extraction might be failing due to Temu's anti-scraping measures.",
        price: "$23.99",
        images: [
          "https://img.temu.com/o/upload_63b02439db5c414fa3ae18b1b4ad31ad.jpg",
          "https://img.temu.com/o/upload_a4fb3bc70f9e41709aa5d22f2e87a2fc.jpg",
          "https://img.temu.com/o/upload_2d1b0dcba6be41e6bc0c8d2b430b2ad4.jpg"
        ],
        platformId: extractedPlatformId,
        platformName: "temu",
        url,
        metadata: { 
          rating: 4.5, 
          reviewCount: 120,
          extractionError: "Failed to extract complete product data from Temu",
          productDetails: {
            "Material": "Cotton Blend",
            "Style": "Casual",
            "Color": "Multiple Options",
            "Pattern": "Solid",
            "Season": "All Season"
          },
          features: [
            "High quality material",
            "Comfortable fit",
            "Stylish design",
            "Suitable for daily wear",
            "Easy to wash"
          ]
        }
      };
    }

    return {
      title,
      description,
      price: price || 'Price not available',
      images,
      platformId: extractedPlatformId,
      platformName: 'temu',
      url,
      metadata: {
        rating,
        reviewCount,
        productDetails,
        features
      }
    };
    
  } catch (error) {
    console.error('Error extracting Temu product:', error);
    
    // Return a fallback product with error information
    return {
      title: "Sample Temu Product (Extraction Failed)",
      description: "This is a sample product because we couldn't extract the real data from Temu. The extraction might be failing due to Temu's anti-scraping measures.",
      price: "$23.99",
      images: [
        "https://img.temu.com/o/upload_63b02439db5c414fa3ae18b1b4ad31ad.jpg",
        "https://img.temu.com/o/upload_a4fb3bc70f9e41709aa5d22f2e87a2fc.jpg",
        "https://img.temu.com/o/upload_2d1b0dcba6be41e6bc0c8d2b430b2ad4.jpg"
      ],
      platformId: "temu-sample",
      platformName: "temu",
      url,
      metadata: { 
        rating: 4.5, 
        reviewCount: 120,
        extractionError: error instanceof Error ? error.message : String(error),
        productDetails: {
          "Material": "Cotton Blend",
          "Style": "Casual",
          "Color": "Multiple Options",
          "Pattern": "Solid",
          "Season": "All Season"
        },
        features: [
          "High quality material",
          "Comfortable fit",
          "Stylish design",
          "Suitable for daily wear",
          "Easy to wash"
        ]
      }
    };
  }
}

// For testing the extraction directly - commented out for ES module compatibility
// To test manually, use:
// import { extractTemuProduct } from './temu-extractor.js';
// const testUrl = 'https://www.temu.com/subject/n9/googleshopping-landingpage-a-psurl.html?goods_id=601099511975028';
// extractTemuProduct(testUrl)
//   .then(product => console.log(JSON.stringify(product, null, 2)))
//   .catch(error => console.error('Extraction error:', error));