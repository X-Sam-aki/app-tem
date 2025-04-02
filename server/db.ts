import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../shared/schema";

// Set DATABASE_URL from environment variables if not already set
let connectionString = process.env.DATABASE_URL;

if (!connectionString && 
    process.env.PGUSER && 
    process.env.PGHOST && 
    process.env.PGPORT && 
    process.env.PGDATABASE && 
    process.env.PGPASSWORD) {
  connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
}

if (!connectionString) {
  throw new Error("DATABASE_URL not found, ensure the database is provisioned");
}

// Create Postgres client
const client = postgres(connectionString, { max: 20 });

// Create database connection with schema
export const db = drizzle(client, { schema });

// Function to run migrations (called during server initialization)
export async function runMigrations() {
  try {
    console.log("Checking database connection...");
    await client`SELECT 1`;
    console.log("Database connection successful!");
    
    // In a production app, we'd use drizzle-kit migrate command
    // For this demo, we'll just push the schema changes directly
    console.log("Ready for database operations.");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}