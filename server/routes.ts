import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  loginSchema, 
  registerSchema, 
  temuUrlSchema, 
  insertProductSchema, 
  insertVideoSchema,
  insertVideoAnalyticsSchema
} from "@shared/schema";
import { ZodError } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import crypto from "crypto";

// Helper for hashing passwords
const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export async function registerRoutes(app: Express): Promise<Server> {
  const MemoryStoreSession = MemoryStore(session);
  
  // Setup session management
  app.use(session({
    secret: process.env.SESSION_SECRET || 'shortify-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 86400000 },
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // Prune expired entries every 24h
    })
  }));
  
  // Setup Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        if (user.password !== hashPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
  
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  
  // Error handling middleware for Zod validation errors
  const handleZodError = (err: unknown, res: Response) => {
    if (err instanceof ZodError) {
      const errors = err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }));
      return res.status(400).json({ errors });
    }
    return res.status(500).json({ message: 'An unexpected error occurred' });
  };
  
  // Auth middleware
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
  };
  
  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      
      // Hash password before storing
      const hashedPassword = hashPassword(userData.password);
      
      // Create user
      const newUser = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  app.post('/api/auth/login', (req, res, next) => {
    try {
      // Validate request data
      loginSchema.parse(req.body);
      
      passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json({ message: info.message || 'Authentication failed' });
        }
        
        req.logIn(user, (err) => {
          if (err) return next(err);
          
          // Return user data without password
          const { password, ...userWithoutPassword } = user;
          return res.json(userWithoutPassword);
        });
      })(req, res, next);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  app.post('/api/auth/logout', (req, res) => {
    req.logout(() => {
      res.json({ message: 'Logged out successfully' });
    });
  });
  
  app.get('/api/auth/me', isAuthenticated, (req, res) => {
    // Return authenticated user data
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });
  
  // Product routes
  app.post('/api/products/extract', isAuthenticated, async (req, res) => {
    try {
      const { url } = temuUrlSchema.parse(req.body);
      
      // Mock product extraction for now (in a real app this would call an external service)
      // In production, this would use a Supabase Edge Function to scrape the product data
      const mockProduct = {
        title: "Sample Temu Product",
        description: "This is a description of the product that would be extracted from Temu",
        price: "$23.99",
        images: ["https://via.placeholder.com/150"],
        platformId: "temu-123456",
        platformName: "temu",
        url,
        metadata: { rating: 4.5, reviewCount: 120 }
      };
      
      res.json(mockProduct);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  app.post('/api/products', isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const productData = insertProductSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const newProduct = await storage.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  app.get('/api/products', isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const products = await storage.getProductsByUserId(user.id);
    res.json(products);
  });
  
  app.get('/api/products/:id', isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await storage.getProduct(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const user = req.user as any;
    if (product.userId !== user.id) {
      return res.status(403).json({ message: 'Unauthorized access to this product' });
    }
    
    res.json(product);
  });
  
  // Video routes
  app.post('/api/videos', isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const videoData = insertVideoSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const newVideo = await storage.createVideo(videoData);
      res.status(201).json(newVideo);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  app.get('/api/videos', isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const videos = await storage.getVideosByUserId(user.id);
    res.json(videos);
  });
  
  app.get('/api/videos/:id', isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const video = await storage.getVideo(id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    const user = req.user as any;
    if (video.userId !== user.id) {
      return res.status(403).json({ message: 'Unauthorized access to this video' });
    }
    
    res.json(video);
  });
  
  app.patch('/api/videos/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await storage.getVideo(id);
      
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      
      const user = req.user as any;
      if (video.userId !== user.id) {
        return res.status(403).json({ message: 'Unauthorized access to this video' });
      }
      
      const updatedVideo = await storage.updateVideo(id, req.body);
      res.json(updatedVideo);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  // Video Analytics routes
  app.post('/api/videos/:id/analytics', isAuthenticated, async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const video = await storage.getVideo(videoId);
      
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      
      const user = req.user as any;
      if (video.userId !== user.id) {
        return res.status(403).json({ message: 'Unauthorized access to this video' });
      }
      
      const analyticsData = insertVideoAnalyticsSchema.parse({
        ...req.body,
        videoId
      });
      
      // Check if analytics already exist for this video
      const existingAnalytics = await storage.getVideoAnalytics(videoId);
      
      if (existingAnalytics) {
        const updatedAnalytics = await storage.updateVideoAnalytics(
          existingAnalytics.id, 
          analyticsData
        );
        return res.json(updatedAnalytics);
      }
      
      const newAnalytics = await storage.createVideoAnalytics(analyticsData);
      res.status(201).json(newAnalytics);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  app.get('/api/videos/:id/analytics', isAuthenticated, async (req, res) => {
    const videoId = parseInt(req.params.id);
    const video = await storage.getVideo(videoId);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    const user = req.user as any;
    if (video.userId !== user.id) {
      return res.status(403).json({ message: 'Unauthorized access to this video' });
    }
    
    const analytics = await storage.getVideoAnalytics(videoId);
    
    if (!analytics) {
      return res.status(404).json({ message: 'Analytics not found for this video' });
    }
    
    res.json(analytics);
  });
  
  // Stats route for dashboard
  app.get('/api/stats', isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const videos = await storage.getVideosByUserId(user.id);
      
      // Calculate aggregate statistics
      let totalViews = 0;
      let totalLikes = 0;
      let totalComments = 0;
      let totalShares = 0;
      
      for (const video of videos) {
        const analytics = await storage.getVideoAnalytics(video.id);
        if (analytics) {
          totalViews += analytics.views || 0;
          totalLikes += analytics.likes || 0;
          totalComments += analytics.comments || 0;
          totalShares += analytics.shares || 0;
        }
      }
      
      res.json({
        totalVideos: videos.length,
        totalViews,
        totalLikes,
        totalComments,
        totalShares,
        subscribers: Math.floor(totalViews * 0.01), // Mock calculation for demo
        revenue: `$${Math.floor(totalViews * 0.005)}` // Mock calculation for demo
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to retrieve stats' });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
