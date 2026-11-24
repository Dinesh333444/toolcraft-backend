import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Manufacturer } from '../models/Manufacturer';
import { User } from '../models/User';
import { mockStore } from '../data/mockStore';
import { authenticateToken, requireRoles } from '../middlewares/auth';

const router = Router();

// Get all verified/trusted manufacturers
router.get('/', async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const manufacturers = await Manufacturer.find({ isVerified: true }).sort({ createdAt: -1 });
      return res.json({ success: true, count: manufacturers.length, data: manufacturers });
    }

    return res.json({ success: true, count: mockStore.manufacturers.length, data: mockStore.manufacturers });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Get all manufacturer registration requests (with optional status filter)
router.get('/admin/requests', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter: any = { role: 'MANUFACTURER_ADMIN' };
      if (status && status !== 'ALL' && typeof status === 'string') {
        filter.status = status.toUpperCase();
      }
      const requests = await User.find(filter).select('-passwordHash').sort({ createdAt: -1 });
      return res.json({ success: true, count: requests.length, data: requests });
    }

    const requests = mockStore.getAllManufacturerRequests(typeof status === 'string' ? status : undefined);
    return res.json({ success: true, count: requests.length, data: requests });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Get list of pending manufacturer registration requests
router.get('/admin/pending', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const pendingUsers = await User.find({
        role: 'MANUFACTURER_ADMIN',
        status: 'PENDING_APPROVAL'
      }).select('-passwordHash').sort({ createdAt: -1 });
      return res.json({ success: true, count: pendingUsers.length, data: pendingUsers });
    }

    const pending = mockStore.getPendingManufacturers();
    return res.json({ success: true, count: pending.length, data: pending });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Approve a manufacturer
router.post('/admin/approve/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findByIdAndUpdate(
        id,
        { status: 'ACTIVE', isActive: true, $unset: { rejectionReason: 1 } },
        { new: true }
      );
      if (!user) return res.status(404).json({ success: false, message: 'Manufacturer not found' });

      // Ensure entry in Manufacturer directory
      const existingMfr = await Manufacturer.findOne({ name: user.companyName });
      if (!existingMfr && user.companyName) {
        await Manufacturer.create({
          userId: user._id,
          name: user.companyName,
          slug: user.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          standards: user.standards ? user.standards.split(',').map(s => s.trim()) : ['ISO 9001:2015'],
          specialization: user.specialization || 'Precision Tooling & Manufacturing',
          benchmarkMetric: 'Verified OEM engineering facility certified on ToolCraft.',
          country: user.facilityLocation ? user.facilityLocation.split(',')[1]?.trim() || 'Germany' : 'Germany',
          city: user.facilityLocation ? user.facilityLocation.split(',')[0]?.trim() || 'Stuttgart' : 'Stuttgart',
          address: user.facilityLocation || 'Industrial Park',
          taxId: user.taxId || `DE${Math.floor(100000000 + Math.random() * 900000000)}`,
          isVerified: true,
          status: 'ACTIVE',
          capabilities: [user.specialization || 'Tooling'],
          certifications: ['ISO 9001:2015'],
          contactEmail: user.email,
          contactPhone: user.phoneNumber || '+49 711 000 000'
        });
      }

      return res.json({
        success: true,
        message: `Manufacturer ${user.companyName} has been APPROVED. They can now log in to their dashboard.`,
        data: user
      });
    }

    const user = mockStore.approveManufacturer(id);
    if (!user) return res.status(404).json({ success: false, message: 'Manufacturer not found' });

    return res.json({
      success: true,
      message: `Manufacturer ${user.companyName} has been APPROVED. They can now log in to their dashboard.`,
      data: user
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Reject a manufacturer with optional reason
router.post('/admin/reject/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findByIdAndUpdate(
        id,
        { status: 'REJECTED', rejectionReason: reason || 'Facility verification documents could not be validated.' },
        { new: true }
      );
      if (!user) return res.status(404).json({ success: false, message: 'Manufacturer not found' });
      return res.json({ success: true, message: `Manufacturer ${user.companyName} registration rejected`, data: user });
    }

    const user = mockStore.rejectManufacturer(id, reason);
    if (!user) return res.status(404).json({ success: false, message: 'Manufacturer not found' });
    return res.json({ success: true, message: `Manufacturer ${user.companyName} registration rejected`, data: user });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get single manufacturer by slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const mfr = await Manufacturer.findOne({ slug: req.params.slug });
      if (!mfr) {
        return res.status(404).json({ success: false, message: 'Manufacturer not found' });
      }
      return res.json({ success: true, data: mfr });
    }

    const mfr = mockStore.manufacturers.find(m => m.slug === req.params.slug);
    if (!mfr) {
      return res.status(404).json({ success: false, message: 'Manufacturer not found' });
    }
    return res.json({ success: true, data: mfr });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
