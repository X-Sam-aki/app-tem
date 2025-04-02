import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  name: text("name"),
  avatar: text("avatar"),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  theme: text("theme").default("light"),
  language: text("language").default("en"),
  notificationsEnabled: boolean("notifications_enabled").default(true),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  price: text("price"),
  images: text("images").array(),
  platformId: text("platform_id"),
  platformName: text("platform_name").default("temu"),
  url: text("url").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").references(() => products.id),
  title: text("title").notNull(),
  description: text("description"),
  templateId: text("template_id"),
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  youtubeVideoId: text("youtube_video_id"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  publishedAt: timestamp("published_at"),
  metadata: jsonb("metadata"),
});

export const videoAnalytics = pgTable("video_analytics", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").notNull().references(() => videos.id),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  ctr: text("ctr"),
  retentionRate: text("retention_rate"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  password: true,
  name: true,
  avatar: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).pick({
  userId: true,
  theme: true,
  language: true,
  notificationsEnabled: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  userId: true,
  title: true,
  description: true,
  price: true,
  images: true,
  platformId: true,
  platformName: true,
  url: true,
  metadata: true,
});

export const insertVideoSchema = createInsertSchema(videos).pick({
  userId: true,
  productId: true,
  title: true,
  description: true,
  templateId: true,
  videoUrl: true,
  thumbnailUrl: true,
  youtubeVideoId: true,
  status: true,
  metadata: true,
});

export const insertVideoAnalyticsSchema = createInsertSchema(videoAnalytics).pick({
  videoId: true,
  views: true,
  likes: true,
  comments: true,
  shares: true,
  ctr: true,
  retentionRate: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

export type InsertVideoAnalytics = z.infer<typeof insertVideoAnalyticsSchema>;
export type VideoAnalytics = typeof videoAnalytics.$inferSelect;

// Extended Schemas for Validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const productUrlSchema = z.object({
  url: z.string().url().refine(url => {
    // Allow URLs from supported platforms
    return url.includes("temu.com") || 
           url.includes("amazon.com");
  }, {
    message: "URL must be from a supported platform (Temu, Amazon)",
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductUrlInput = z.infer<typeof productUrlSchema>;

// Keep temuUrlSchema for backward compatibility (deprecated)
export const temuUrlSchema = productUrlSchema;
export type TemuUrlInput = ProductUrlInput;
