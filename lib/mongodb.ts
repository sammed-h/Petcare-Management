import mongoose from "mongoose";
import './models'; // Ensure all models are registered

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // 1. Ensure models are registered first
  // By importing models.ts, we trigger the registration of all models.
  // We use the 'models' object just to prevent tree-shaking from removing the import.
  const { models } = await import('./models');
  if (!models.User || !models.Pet) {
    console.warn("Mongoose models were expected to be registered but might be missing.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("New MongoDB connection established");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error("CRITICAL: Database connection failed:", e);
    throw e;
  }
}

export default dbConnect;
