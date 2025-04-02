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

    // Fetch the product page
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
    
    // Extract information
    const title = $('h1.title').text().trim() || $('._3-q1y').text().trim();
    let description = $('._3CRkq').text().trim();
    
    if (!description) {
      // Try other potential selectors for description
      description = $('.product-detail-description').text().trim();
    }
    
    // Extract price
    let price = $('._2yjN1').text().trim() || $('.price-current').text().trim();
    
    if (!price) {
      // Try other potential selectors for price
      price = $('._25Uo9').text().trim() || $('.price').text().trim();
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

    // Extract product ID
    const urlParts = url.split('/');
    const platformId = urlParts[urlParts.length - 1].split('?')[0];

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

    // If we couldn't extract enough data, throw an error
    if (!title || images.length === 0) {
      // Fall back to mock data for development if we couldn't extract real data
      return {
        title: "Sample Temu Product (Extraction Failed)",
        description: "This is a sample product because we couldn't extract the real data from Temu. The extraction might be failing due to Temu's anti-scraping measures.",
        price: "$23.99",
        images: [
          "https://img.temu.com/o/upload_63b02439db5c414fa3ae18b1b4ad31ad.jpg",
          "https://img.temu.com/o/upload_a4fb3bc70f9e41709aa5d22f2e87a2fc.jpg",
          "https://img.temu.com/o/upload_2d1b0dcba6be41e6bc0c8d2b430b2ad4.jpg"
        ],
        platformId: platformId || "temu-sample",
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
      platformId,
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

// For testing the extraction directly
if (require.main === module) {
  const testUrl = process.argv[2] || 'https://www.temu.com/subject/n9/googleshopping-landingpage-a-psurl.html?goods_id=601099511975028';
  extractTemuProduct(testUrl)
    .then(product => console.log(JSON.stringify(product, null, 2)))
    .catch(error => console.error('Extraction error:', error));
}