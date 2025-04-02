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
    const [user] = await db.insert(users).values(insertUser).returning();
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
    const [product] = await db.insert(products).values(insertProduct).returning();
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
    const result = await db.delete(products).where(eq(products.id, id));
    return !!result;
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
    const [video] = await db.insert(videos).values(insertVideo).returning();
    return video;
  }

  async updateVideo(id: number, videoData: Partial<InsertVideo>): Promise<Video | undefined> {
    const [video] = await db
      .update(videos)
      .set(videoData)
      .where(eq(videos.id, id))
      .returning();
    return video || undefined;
  }

  async deleteVideo(id: number): Promise<boolean> {
    const result = await db.delete(videos).where(eq(videos.id, id));
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
      .set(analyticsData)
      .where(eq(videoAnalytics.id, id))
      .returning();
    return analytics || undefined;
  }
}