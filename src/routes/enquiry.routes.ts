import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Enquiry } from '../models/Enquiry';
import { mockStore } from '../data/mockStore';
import { authenticateToken, requireRoles, AuthRequest } from '../middlewares/auth';

const router = Router();

// Submit an RFQ / Technical Enquiry (Saved with customerId)
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      productId,
      customerId,
      productTitle = 'VRX-5F Sub-Micron Solid Carbide End Mill Series',
      productModel = 'VRX-120-5F-ALTIN',
      manufacturerName = 'Stuttgart Grinding & Carbide Works',
      fullName,
      companyName,
      email,
      phone,
      requiredQuantity,
      targetTimeline = 'Within 30 Days',
      requirements
    } = req.body;

    if (!fullName || !companyName || !email || !phone || !requiredQuantity || !requirements) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory engineering enquiry parameters'
      });
    }

    if (mongoose.connection.readyState === 1) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const enquiryCode = `TC-RFQ-${randomNum}`;

      const enquiry = await Enquiry.create({
        enquiryCode,
        productId,
        customerId: customerId || undefined,
        productTitle,
        productModel,
        manufacturerName,
        fullName,
        companyName,
        email,
        phone,
        requiredQuantity,
        targetTimeline,
        requirements,
        status: 'SUBMITTED'
      });

      return res.status(201).json({
        success: true,
        message: 'Direct enquiry dispatched to manufacturer engineering desk',
        data: enquiry
      });
    }

    // Fallback store
    const enquiry = mockStore.addEnquiry({
      productId,
      customerId,
      productTitle,
      productModel,
      manufacturerName,
      fullName,
      companyName,
      email,
      phone,
      requiredQuantity,
      targetTimeline,
      requirements
    });

    return res.status(201).json({
      success: true,
      message: 'Direct enquiry dispatched to manufacturer engineering desk',
      data: enquiry
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get Enquiries raised by current logged-in customer
router.get('/my', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    if (!userId && !userEmail) {
      return res.status(401).json({ success: false, message: 'Customer login required' });
    }

    if (mongoose.connection.readyState === 1) {
      const query: any = {
        $or: [
          { customerId: userId },
          { email: userEmail?.toLowerCase() }
        ]
      };
      const enquiries = await Enquiry.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: enquiries.length, data: enquiries });
    }

    const enquiries = mockStore.getCustomerEnquiries(userId, userEmail);
    return res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// List Enquiries with optional status filter
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter: any = {};
      if (status && status !== 'All' && typeof status === 'string') {
        filter.status = new RegExp(`^${status}$`, 'i');
      }
      const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, count: enquiries.length, data: enquiries });
    }

    const enquiries = mockStore.getEnquiries(typeof status === 'string' ? status : undefined);
    return res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Respond with Formal Quotation
router.post('/:id/quote', authenticateToken, requireRoles('MANUFACTURER_ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { unitPrice, currency = 'USD', leadTimeWeeks = 2, freightCharges = 0, terms } = req.body;

    if (mongoose.connection.readyState === 1) {
      const enquiry = await Enquiry.findById(req.params.id);
      if (!enquiry) {
        return res.status(404).json({ success: false, message: 'Enquiry not found' });
      }

      enquiry.status = 'QUOTED';
      enquiry.quotation = {
        unitPrice,
        currency,
        leadTimeWeeks,
        freightCharges,
        terms: terms || 'Standard industrial FOB terms. Batch inspection sheet included.',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        issuedAt: new Date()
      };

      await enquiry.save();
      return res.json({ success: true, message: 'Quotation issued to buyer', data: enquiry });
    }

    // Fallback store
    const enquiry = mockStore.quoteEnquiry(req.params.id, {
      unitPrice,
      currency,
      leadTimeWeeks,
      freightCharges,
      terms
    });

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    return res.json({ success: true, message: 'Quotation issued to buyer', data: enquiry });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
