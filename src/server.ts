import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { connectDB } from './config/db';
import { seedDatabase } from './seed';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import enquiryRoutes from './routes/enquiry.routes';
import manufacturerRoutes from './routes/manufacturer.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Images Directory
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/images', express.static(path.join(__dirname, '../../frontend/public/images')));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/enquiries', enquiryRoutes);
app.use('/api/v1/manufacturers', manufacturerRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ToolCraft V2 API',
    database: mongoose.connection.readyState === 1 ? 'mongodb' : 'memory_store',
    timestamp: new Date()
  });
});

// Start Server & Connect Database
const startServer = async () => {
  try {
    await connectDB();
    
    // Automatically seed data ONLY if connected to real MongoDB and empty
    if (mongoose.connection.readyState === 1) {
      const { Product } = await import('./models/Product');
      const count = await Product.countDocuments();
      if (count === 0) {
        console.log('[Server] No products found in MongoDB. Automatically seeding initial catalogue...');
        await seedDatabase();
      }
    }

    app.listen(PORT, () => {
      console.log(`[Server] ToolCraft V2 Express API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[Server] Fatal startup error:', err);
    process.exit(1);
  }
};

startServer();

export default app;
