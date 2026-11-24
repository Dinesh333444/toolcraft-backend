import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/toolcraft';
  try {
    // Fast 1 second timeout
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 1000 });
    console.log(`[Database] Connected successfully to MongoDB at ${uri}`);
  } catch (err: any) {
    console.warn(`[Database] MongoDB offline (${err.message}). Active with robust in-memory industrial catalogue.`);
  }
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};
