import { Schema, model, Document, Types } from 'mongoose';

export interface IEnquiry extends Document {
  enquiryCode: string; // e.g. "TC-RFQ-9021"
  productId?: Types.ObjectId;
  customerId?: Types.ObjectId;
  productTitle: string;
  productModel: string;
  manufacturerName: string;
  
  // Buyer Lead Info
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  requiredQuantity: string;
  targetTimeline: string; // e.g. "Within 30 Days", "Immediate", "Annual Contract"
  requirements: string;
  
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'QUOTED' | 'ACCEPTED' | 'CLOSED';
  
  // Quotation response if provided by manufacturer
  quotation?: {
    unitPrice: number;
    currency: string;
    leadTimeWeeks: number;
    freightCharges: number;
    terms: string;
    validUntil: Date;
    issuedAt: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    enquiryCode: { type: String, required: true, unique: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    productTitle: { type: String, required: true },
    productModel: { type: String, required: true },
    manufacturerName: { type: String, required: true },

    fullName: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    requiredQuantity: { type: String, required: true, trim: true },
    targetTimeline: { type: String, default: 'Within 30 Days' },
    requirements: { type: String, required: true },

    status: {
      type: String,
      enum: ['SUBMITTED', 'UNDER_REVIEW', 'QUOTED', 'ACCEPTED', 'CLOSED'],
      default: 'SUBMITTED'
    },

    quotation: {
      unitPrice: Number,
      currency: { type: String, default: 'USD' },
      leadTimeWeeks: Number,
      freightCharges: Number,
      terms: String,
      validUntil: Date,
      issuedAt: Date
    }
  },
  { timestamps: true }
);

export const Enquiry = model<IEnquiry>('Enquiry', EnquirySchema);
