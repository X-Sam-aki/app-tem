import { eq } from 'drizzle-orm';
import { db } from './db';
import { 
  InsertUser, 
  User, 
  InsertProduct, 
  Product, 
  InsertVideo, 
  Video, 
  InsertVideoAnalytics, 
  VideoAnalytics,
  users,
  products,
  videos,
  videoAnalytics
} from '@shared/schema';
import { IStorage } from './storage';

export class DbStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.email, email));
    return results[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const results = await db.insert(users).values(user).returning();
    return results[0];
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    const results = await db.select().from(products).where(eq(products.id, id));
    return results[0];
  }

  async getProductsByUserId(userId: number): Promise<Product[]> {
    return db.select().from(products).where(eq(products.userId, userId));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const results = await db.insert(products).values(product).returning();
    return results[0];
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const results = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return results[0];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const results = await db.delete(products).where(eq(products.id, id)).returning();
    return results.length > 0;
  }

  // Video operations
  async getVideo(id: number): Promise<Video | undefined> {
    const results = await db.select().from(videos).where(eq(videos.id, id));
    return results[0];
  }

  async getVideosByUserId(userId: number): Promise<Video[]> {
    return db.select().from(videos).where(eq(videos.userId, userId));
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const results = await db.insert(videos).values(video).returning();
    return results[0];
  }

  async updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video | undefined> {
    const results = await db
      .update(videos)
      .set(video)
      .where(eq(videos.id, id))
      .returning();
    return results[0];
  }

  async deleteVideo(id: number): Promise<boolean> {
    const results = await db.delete(videos).where(eq(videos.id, id)).returning();
    return results.length > 0;
  }

  // Video Analytics operations
  async getVideoAnalytics(videoId: number): Promise<VideoAnalytics | undefined> {
    const results = await db.select().from(videoAnalytics).where(eq(videoAnalytics.videoId, videoId));
    return results[0];
  }

  async createVideoAnalytics(analytics: InsertVideoAnalytics): Promise<VideoAnalytics> {
    const results = await db.insert(videoAnalytics).values(analytics).returning();
    return results[0];
  }

  async updateVideoAnalytics(id: number, analytics: Partial<InsertVideoAnalytics>): Promise<VideoAnalytics | undefined> {
    const results = await db
      .update(videoAnalytics)
      .set(analytics)
      .where(eq(videoAnalytics.id, id))
      .returning();
    return results[0];
  }
}