import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Thrown lazily (inside dbConnect) in dev too, so importing this file
  // never crashes a build before env vars are loaded.
  console.warn("MONGODB_URI is not set. Add it to your .env.local file.");
}

// Reuse the connection across hot reloads / serverless invocations.
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error(
        "Missing MONGODB_URI. Copy .env.example to .env.local and set your connection string."
      );
    }
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
