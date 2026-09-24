import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    tagline: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price in INR is required'],
      min: [0, 'Price cannot be negative'],
    },
    unit: {
      type: String,
      default: 'per kg',
      enum: ['per kg', 'per piece', 'per pair', 'per item'],
    },
    turnaround: {
      type: String,
      default: '24-48 Hours',
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    popular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for formatted price tag (e.g. ₹79/kg)
planSchema.virtual('priceDisplay').get(function () {
  const cleanUnit = this.unit ? this.unit.replace('per ', '') : 'kg';
  return `₹${this.price}/${cleanUnit}`;
});

planSchema.set('toJSON', { virtuals: true });
planSchema.set('toObject', { virtuals: true });

export const Plan = mongoose.model('Plan', planSchema);
