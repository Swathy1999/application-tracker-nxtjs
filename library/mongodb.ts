import mongoose from "mongoose";

const connectionString = process.env.DB_CONNECTION_URL;

if (!connectionString) {
  throw new Error("DB_CONNECTION_URL is missing from .env.local");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(connectionString).catch((error) => {
      cached.promise = null;
      console.error("MongoDB connection failed:", error);
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
