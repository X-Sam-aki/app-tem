import { 
  users, type User, type InsertUser, 
  products, type Product, type InsertProduct,
  videos, type Video, type InsertVideo,
  videoAnalytics, type VideoAnalytics, type InsertVideoAnalytics
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
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
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByUserId(userId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.userId, userId));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const [deletedProduct] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    return !!deletedProduct;
  }
  
  // Video operations
  async getVideo(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video || undefined;
  }

  async getVideosByUserId(userId: number): Promise<Video[]> {
    return await db.select().from(videos).where(eq(videos.userId, userId));
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const [video] = await db
      .insert(videos)
      .values(insertVideo)
      .returning();
    return video;
  }

  async updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video | undefined> {
    const [updatedVideo] = await db
      .update(videos)
      .set(video)
      .where(eq(videos.id, id))
      .returning();
    return updatedVideo || undefined;
  }

  async deleteVideo(id: number): Promise<boolean> {
    const [deletedVideo] = await db
      .delete(videos)
      .where(eq(videos.id, id))
      .returning();
    return !!deletedVideo;
  }
  
  // Video Analytics operations
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

  async updateVideoAnalytics(id: number, analytics: Partial<InsertVideoAnalytics>): Promise<VideoAnalytics | undefined> {
    const [updatedAnalytics] = await db
      .update(videoAnalytics)
      .set(analytics)
      .where(eq(videoAnalytics.id, id))
      .returning();
    return updatedAnalytics || undefined;
  }
}