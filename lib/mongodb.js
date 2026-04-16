import mongoose from "mongoose";

const globalForMongoose = globalThis;

if (!globalForMongoose.__mongooseCache) {
  globalForMongoose.__mongooseCache = {
    conn: null,
    promise: null
  };
}

export async function connectToDatabase() {
  const cache = globalForMongoose.__mongooseCache;

  if (cache.conn) {
    return cache.conn;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
