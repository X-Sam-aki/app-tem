import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import * as schema from '@shared/schema';

// For local development with PostgreSQL
const connectionString = process.env.DATABASE_URL!;

// Create postgres connection
const client = postgres(connectionString, { max: 1 });

// Create drizzle instance
export const db = drizzle(client, { schema });

// Run migrations on startup (this creates the tables if they don't exist)
export async function runMigrations() {
  console.log('Running database setup...');
  try {
    // Check if tables exist by querying the users table
    const result = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;
    
    const tablesExist = result[0]?.exists || false;
    
    if (!tablesExist) {
      console.log('Tables do not exist, creating schema from scratch...');
      
      // Create meta directory and journal file if needed
      const metaDir = './drizzle/meta';
      const journalPath = path.join(metaDir, '_journal.json');
      
      if (!fs.existsSync(metaDir)) {
        fs.mkdirSync(metaDir, { recursive: true });
      }
      
      if (!fs.existsSync(journalPath)) {
        fs.writeFileSync(journalPath, JSON.stringify({ version: "5", dialect: "pg", entries: [] }));
      }
      
      // Run schema push instead of migrations
      const pushScript = 'npm run db:push';
      console.log(`Executing: ${pushScript}`);
      const { execSync } = require('child_process');
      execSync(pushScript, { stdio: 'inherit' });
    }
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}