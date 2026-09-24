import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Pickup address is required'],
      trim: true,
    },
    service: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    serviceId: {
      type: String,
      default: 'wash-fold',
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, 'Quantity must be at least 1'],
    },
    unit: {
      type: String,
      default: 'kg',
    },
    estimatedPrice: {
      type: Number,
      required: [true, 'Estimated price is required'],
      min: [0, 'Estimated price cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    pickupDate: {
      type: String,
      required: [true, 'Pickup date is required'],
    },
    pickupTimeSlot: {
      type: String,
      required: [true, 'Pickup time slot is required'],
    },
    specialInstructions: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'PLACED',
        'PICKUP_SCHEDULED',
        'IN_WASH',
        'IRONED_PACKED',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
      ],
      default: 'PICKUP_SCHEDULED',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

export const Order = mongoose.model('Order', orderSchema);
