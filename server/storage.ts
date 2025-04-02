import { 
  users, type User, type InsertUser, 
  products, type Product, type InsertProduct,
  videos, type Video, type InsertVideo,
  videoAnalytics, type VideoAnalytics, type InsertVideoAnalytics
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByUserId(userId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Video operations
  getVideo(id: number): Promise<Video | undefined>;
  getVideosByUserId(userId: number): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video | undefined>;
  deleteVideo(id: number): Promise<boolean>;
  
  // Video Analytics operations
  getVideoAnalytics(videoId: number): Promise<VideoAnalytics | undefined>;
  createVideoAnalytics(analytics: InsertVideoAnalytics): Promise<VideoAnalytics>;
  updateVideoAnalytics(id: number, analytics: Partial<InsertVideoAnalytics>): Promise<VideoAnalytics | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private videos: Map<number, Video>;
  private videoAnalytics: Map<number, VideoAnalytics>;
  private currentUserId: number;
  private currentProductId: number;
  private currentVideoId: number;
  private currentAnalyticsId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.videos = new Map();
    this.videoAnalytics = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentVideoId = 1;
    this.currentAnalyticsId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    
    // Remove any optional fields, then add them explicitly with correct nulls
    const { name, avatar, ...requiredFields } = insertUser;
    
    const user: User = { 
      ...requiredFields, 
      id, 
      createdAt, 
      name: name || null,
      avatar: avatar || null
    };
    
    this.users.set(id, user);
    return user;
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByUserId(userId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.userId === userId,
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const createdAt = new Date();
    
    // Remove optional fields, then add them with correct null values
    const { 
      description, price, images, platformId, 
      platformName, metadata, ...requiredFields 
    } = insertProduct;
    
    const product: Product = { 
      ...requiredFields, 
      id, 
      createdAt, 
      description: description || null,
      price: price || null,
      images: images || null,
      platformId: platformId || null,
      platformName: platformName || null,
      metadata: metadata || null
    };
    
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = await this.getProduct(id);
    if (!existingProduct) return undefined;

    const updatedProduct = { ...existingProduct, ...product };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Video operations
  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getVideosByUserId(userId: number): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(
      (video) => video.userId === userId,
    );
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.currentVideoId++;
    const createdAt = new Date();
    
    // Separate required and optional fields
    const { 
      description, metadata, productId, templateId, videoUrl, 
      thumbnailUrl, youtubeVideoId, status, ...requiredFields 
    } = insertVideo;
    
    const video: Video = { 
      ...requiredFields, 
      id, 
      createdAt, 
      publishedAt: null,
      status: status || 'draft',
      description: description || null,
      metadata: metadata || null,
      productId: productId || null,
      templateId: templateId || null,
      videoUrl: videoUrl || null,
      thumbnailUrl: thumbnailUrl || null,
      youtubeVideoId: youtubeVideoId || null
    };
    
    this.videos.set(id, video);
    return video;
  }

  async updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video | undefined> {
    const existingVideo = await this.getVideo(id);
    if (!existingVideo) return undefined;

    const updatedVideo = { ...existingVideo, ...video };
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }

  async deleteVideo(id: number): Promise<boolean> {
    return this.videos.delete(id);
  }

  // Video Analytics operations
  async getVideoAnalytics(videoId: number): Promise<VideoAnalytics | undefined> {
    return Array.from(this.videoAnalytics.values()).find(
      (analytics) => analytics.videoId === videoId,
    );
  }

  async createVideoAnalytics(insertAnalytics: InsertVideoAnalytics): Promise<VideoAnalytics> {
    const id = this.currentAnalyticsId++;
    const updatedAt = new Date();
    
    // Separate required and optional fields
    const {
      views, likes, comments, shares, ctr, 
      retentionRate, ...requiredFields
    } = insertAnalytics;
    
    const analytics: VideoAnalytics = { 
      ...requiredFields, 
      id, 
      updatedAt: updatedAt, 
      views: views === undefined ? 0 : views,
      likes: likes === undefined ? 0 : likes,
      comments: comments === undefined ? 0 : comments,
      shares: shares === undefined ? 0 : shares,
      ctr: ctr || null,
      retentionRate: retentionRate || null
    };
    
    this.videoAnalytics.set(id, analytics);
    return analytics;
  }

  async updateVideoAnalytics(id: number, analytics: Partial<InsertVideoAnalytics>): Promise<VideoAnalytics | undefined> {
    const existingAnalytics = Array.from(this.videoAnalytics.values()).find(
      (a) => a.id === id,
    );
    if (!existingAnalytics) return undefined;

    const updatedAnalytics = { 
      ...existingAnalytics, 
      ...analytics, 
      updatedAt: new Date() 
    };
    this.videoAnalytics.set(id, updatedAnalytics);
    return updatedAnalytics;
  }
}

// Import our database storage implementation
import { DatabaseStorage } from "./database-storage";

// Create and export the storage instance
// Use DatabaseStorage for production with real PostgreSQL
export const storage: IStorage = new DatabaseStorage();

// For testing purposes, we can still use MemStorage
// export const storage: IStorage = new MemStorage();
