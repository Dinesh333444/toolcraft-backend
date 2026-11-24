import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { mockStore } from '../data/mockStore';
import { authenticateToken, requireRoles, AuthRequest } from '../middlewares/auth';

const router = Router();

// Get Products Catalog with Category, Query, and New Releases Filter
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, q, newReleases, sort } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter: any = { status: 'PUBLISHED' };

      if (category && category !== 'All Categories' && category !== 'all') {
        filter.category = category;
      }

      if (newReleases === 'true' || newReleases === '1') {
        filter.isNewRelease = true;
      }

      if (q && typeof q === 'string' && q.trim()) {
        const searchRegex = new RegExp(q.trim(), 'i');
        filter.$or = [
          { title: searchRegex },
          { modelNumber: searchRegex },
          { description: searchRegex },
          { manufacturerName: searchRegex },
          { 'standards': searchRegex }
        ];
      }

      let sortOption: any = { createdAt: -1 };
      if (sort === 'oldest') sortOption = { createdAt: 1 };
      if (sort === 'title') sortOption = { title: 1 };

      const products = await Product.find(filter).sort(sortOption);
      return res.json({ success: true, count: products.length, data: products });
    }

    // Fallback store
    const products = mockStore.getProducts({
      category: typeof category === 'string' ? category : undefined,
      q: typeof q === 'string' ? q : undefined,
      newReleases: newReleases === 'true'
    });

    return res.json({ success: true, count: products.length, data: products });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get Single Product by Slug or ID
router.get('/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;

    if (mongoose.connection.readyState === 1) {
      let product = await Product.findOne({ slug: identifier });
      if (!product && identifier.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(identifier);
      }
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product dossier not found' });
      }
      return res.json({ success: true, data: product });
    }

    // Fallback store
    const product = mockStore.getProduct(identifier);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product dossier not found' });
    }

    return res.json({ success: true, data: product });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Create Product from Manufacturer Publisher (Screenshots 3-6)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const productData = req.body;
    const slug = productData.slug || productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const sku = productData.sku || productData.modelNumber || `SKU-${Date.now().toString(36).toUpperCase()}`;

    // Format highlights into previewSpecs
    const previewSpecs = productData.previewSpecs || [];
    if (productData.highlights && Array.isArray(productData.highlights)) {
      productData.highlights.forEach((h: string) => {
        if (h && h.includes(':')) {
          const [label, val] = h.split(':');
          previewSpecs.push({ label: label.trim(), value: val.trim() });
        }
      });
    }

    if (previewSpecs.length === 0) {
      previewSpecs.push(
        { label: 'Precision Grade', value: 'Factory Tested' },
        { label: 'Tolerance', value: '±0.002 mm' }
      );
    }

    const payload = {
      ...productData,
      slug,
      sku,
      previewSpecs,
      manufacturerName: req.body.manufacturerName || req.user?.companyName || req.user?.name || 'Stuttgart Grinding & Carbide Works',
      primaryImage: productData.primaryImage || '/images/carbide-rotary-burrs.jpg',
      galleryImages: productData.galleryImages?.length ? productData.galleryImages : ['/images/carbide-rotary-burrs.jpg'],
      photoCount: productData.galleryImages?.length || 1,
      hasVideo: !!productData.videoUrl,
      specCount: productData.specCount || (productData.parameterRows?.length || 14)
    };

    if (mongoose.connection.readyState === 1) {
      const product = await Product.create(payload);
      return res.status(201).json({ success: true, data: product });
    }

    const newProd = mockStore.addProduct(payload);
    return res.status(201).json({ success: true, data: newProd });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
