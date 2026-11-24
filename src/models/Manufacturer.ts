import { Schema, model, Document, Types } from 'mongoose';

export interface IManufacturer extends Document {
  userId?: Types.ObjectId;
  name: string;
  slug: string;
  standards: string[]; // e.g. ["DIN 6527", "ISO 1832", "DIN 6535 HA"]
  specialization: string; // e.g. "5-Axis CNC Flute Grinding & AlTiN PVD Deposition"
  benchmarkMetric: string; // e.g. "Batch Runout ≤ 0.003 mm TIR verified on 100% optical laser presetter."
  country: string;
  city: string;
  address: string;
  taxId?: string;
  registrationNumber?: string;
  isVerified: boolean;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'ACTIVE' | 'ACTION_REQUIRED' | 'REJECTED';
  capabilities: string[];
  certifications: string[];
  contactEmail: string;
  contactPhone: string;
  createdAt: Date;
}

const ManufacturerSchema = new Schema<IManufacturer>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    standards: [{ type: String }],
    specialization: { type: String, required: true },
    benchmarkMetric: { type: String, required: true },
    country: { type: String, default: 'Germany' },
    city: { type: String, default: 'Stuttgart' },
    address: { type: String },
    taxId: { type: String },
    registrationNumber: { type: String },
    isVerified: { type: Boolean, default: true },
    status: { 
      type: String, 
      enum: ['DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'ACTION_REQUIRED', 'REJECTED'],
      default: 'ACTIVE'
    },
    capabilities: [{ type: String }],
    certifications: [{ type: String }],
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
  },
  { timestamps: true }
);

export const Manufacturer = model<IManufacturer>('Manufacturer', ManufacturerSchema);
