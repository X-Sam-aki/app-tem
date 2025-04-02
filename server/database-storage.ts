import { 
  users, type User, type InsertUser, 
  products, type Product, type InsertProduct,
  videos, type Video, type InsertVideo,
  videoAnalytics, type VideoAnalytics, type InsertVideoAnalytics,
  usersRelations, productsRelations, videosRelations, videoAnalyticsRelations
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByUserId(userId: number): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.userId, userId))
      .orderBy(desc(products.createdAt));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    // First delete any related videos
    const relatedVideos = await db
      .select({ id: videos.id })
      .from(videos)
      .where(eq(videos.productId, id));
    
    for (const video of relatedVideos) {
      await this.deleteVideo(video.id);
    }
    
    // Then delete the product
    const result = await db
      .delete(products)
      .where(eq(products.id, id));
    
    return !!result;
  }

  // Video operations
  async getVideo(id: number): Promise<Video | undefined> {
    const [video] = await db
      .select()
      .from(videos)
      .where(eq(videos.id, id));
    
    return video || undefined;
  }

  async getVideoWithDetails(id: number): Promise<(Video & { product?: Product, analytics?: VideoAnalytics }) | undefined> {
    const [result] = await db
      .select({
        video: videos,
        product: products,
        analytics: videoAnalytics
      })
      .from(videos)
      .leftJoin(products, eq(videos.productId, products.id))
      .leftJoin(videoAnalytics, eq(videos.id, videoAnalytics.videoId))
      .where(eq(videos.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.video,
      product: result.product || undefined,
      analytics: result.analytics || undefined
    };
  }

  async getVideosByUserId(userId: number): Promise<Video[]> {
    return await db
      .select()
      .from(videos)
      .where(eq(videos.userId, userId))
      .orderBy(desc(videos.createdAt));
  }

  async getVideosWithDetailsByUserId(userId: number): Promise<(Video & { product?: Product, analytics?: VideoAnalytics })[]> {
    const results = await db
      .select({
        video: videos,
        product: products,
        analytics: videoAnalytics
      })
      .from(videos)
      .leftJoin(products, eq(videos.productId, products.id))
      .leftJoin(videoAnalytics, eq(videos.id, videoAnalytics.videoId))
      .where(eq(videos.userId, userId))
      .orderBy(desc(videos.createdAt));
    
    return results.map(result => ({
      ...result.video,
      product: result.product || undefined,
      analytics: result.analytics || undefined
    }));
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const [video] = await db
      .insert(videos)
      .values(insertVideo)
      .returning();
    return video;
  }

  async updateVideo(id: number, videoData: Partial<InsertVideo>): Promise<Video | undefined> {
    // Check if video is being published for the first time
    let updateData: Record<string, any> = { ...videoData };
    
    if (videoData.status === 'published') {
      const existingVideo = await this.getVideo(id);
      // Set publishedAt to now if it's first time publishing
      if (existingVideo && existingVideo.status !== 'published') {
        updateData.publishedAt = new Date();
      }
    }
    
    const [video] = await db
      .update(videos)
      .set(updateData)
      .where(eq(videos.id, id))
      .returning();
    
    return video || undefined;
  }

  async deleteVideo(id: number): Promise<boolean> {
    // First delete any analytics
    await db
      .delete(videoAnalytics)
      .where(eq(videoAnalytics.videoId, id));
    
    // Then delete the video
    const result = await db
      .delete(videos)
      .where(eq(videos.id, id));
    
    return !!result;
  }

  // VideoAnalytics operations
  async getVideoAnalytics(videoId: number): Promise<VideoAnalytics | undefined> {
    const [analytics] = await db
      .select()
      .from(videoAnalytics)
      .where(eq(videoAnalytics.videoId, videoId));
    
    return analytics || undefined;
  }

  async createVideoAnalytics(insertAnalytics: InsertVideoAnalytics): Promise<VideoAnalytics> {
    const [analytics] = await db
      .insert(videoAnalytics)
      .values(insertAnalytics)
      .returning();
    
    return analytics;
  }

  async updateVideoAnalytics(id: number, analyticsData: Partial<InsertVideoAnalytics>): Promise<VideoAnalytics | undefined> {
    const [analytics] = await db
      .update(videoAnalytics)
      .set({
        ...analyticsData,
        updatedAt: new Date()
      })
      .where(eq(videoAnalytics.id, id))
      .returning();
    
    return analytics || undefined;
  }
}