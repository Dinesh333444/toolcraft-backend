import { Schema, model, Document, Types } from 'mongoose';

export interface IGeometrySpec {
  cuttingDiameterD1?: number; // mm
  diameterTolerance?: string; // e.g. "h6 (+0 / -0.011) mm"
  shankDiameterD2?: number; // mm
  fluteLengthL2?: number; // mm
  overallLengthL1?: number; // mm
  flutesZ?: number;
  helixAngle?: string; // e.g. "37° / 40° deg"
  cornerChamfer?: string; // e.g. "0.20 × 45° mm"
}

export interface IMetallurgySpec {
  carbideSubstrate?: string; // "WC-10%Co (0.4 µm) / ISO K10/K20"
  coating?: string; // "AlTiN-Si Nano (4.2 µm)"
  hardness?: string; // "3,450 HV 0.05"
  maxTemp?: string; // "1,100 °C"
}

export interface ICuttingParamSpec {
  feedRate?: string; // "0.045 - 0.085 mm/tooth"
  cuttingSpeed?: string; // "140 - 210 m/min"
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  sku: string;
  modelNumber: string;
  series: string;
  standards: string[];
  category: 'Automotive' | 'Precision Tools' | 'Carbide Tools' | 'Industrial Machinery';
  categorySlug: string;
  description: string;
  isNewRelease: boolean;
  status: 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'DELISTED';
  manufacturerId?: Types.ObjectId;
  manufacturerName: string;
  previewSpecs: Array<{ label: string; value: string }>;
  geometry: IGeometrySpec;
  metallurgy: IMetallurgySpec;
  cuttingParameters: ICuttingParamSpec;
  machineSpecs?: {
    repeatability?: string;
    spindleSpeed?: string;
    trunnionTilt?: string;
    controller?: string;
  };
  primaryImage: string;
  galleryImages: string[];
  videoUrl?: string;
  specCount: number;
  hasVideo: boolean;
  photoCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    sku: { type: String, required: true, trim: true },
    modelNumber: { type: String, required: true, trim: true },
    series: { type: String, default: '2026 Series K-900' },
    standards: [{ type: String }],
    category: { 
      type: String, 
      required: true,
      enum: ['Automotive', 'Precision Tools', 'Carbide Tools', 'Industrial Machinery']
    },
    categorySlug: { type: String, required: true },
    description: { type: String, required: true },
    isNewRelease: { type: Boolean, default: true },
    status: { 
      type: String, 
      enum: ['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'DELISTED'],
      default: 'PUBLISHED'
    },
    manufacturerId: { type: Schema.Types.ObjectId, ref: 'Manufacturer' },
    manufacturerName: { type: String, required: true },
    previewSpecs: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true }
      }
    ],
    geometry: {
      cuttingDiameterD1: Number,
      diameterTolerance: String,
      shankDiameterD2: Number,
      fluteLengthL2: Number,
      overallLengthL1: Number,
      flutesZ: Number,
      helixAngle: String,
      cornerChamfer: String
    },
    metallurgy: {
      carbideSubstrate: String,
      coating: String,
      hardness: String,
      maxTemp: String
    },
    cuttingParameters: {
      feedRate: String,
      cuttingSpeed: String
    },
    machineSpecs: {
      repeatability: String,
      spindleSpeed: String,
      trunnionTilt: String,
      controller: String
    },
    primaryImage: { type: String, required: true },
    galleryImages: [{ type: String }],
    videoUrl: { type: String },
    specCount: { type: Number, default: 12 },
    hasVideo: { type: Boolean, default: true },
    photoCount: { type: Number, default: 2 },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, isNewRelease: 1 });
ProductSchema.index({ title: 'text', modelNumber: 'text', description: 'text' });

export const Product = model<IProduct>('Product', ProductSchema);
