import { Order } from '../models/Order.js';

export const VALID_ORDER_STATUSES = [
  'PLACED',
  'PICKUP_SCHEDULED',
  'IN_WASH',
  'IRONED_PACKED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

/**
 * Service Layer (Clean Architecture)
 * Contains pure business rules, validation, and database operations.
 * Decoupled from Express req/res.
 */

/**
 * Generate a unique, human-friendly order tracking ID
 * Format: FF-YYYY-XXXX (e.g. FF-2026-8914)
 */
export async function generateUniqueTrackingId() {
  const currentYear = new Date().getFullYear();
  let trackingId;
  let exists = true;

  while (exists) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    trackingId = `FF-${currentYear}-${randomSuffix}`;
    const found = await Order.findOne({ trackingId }).lean();
    if (!found) {
      exists = false;
    }
  }

  return trackingId;
}

/**
 * Validate order business rules before creation
 */
function validateOrderPayload(data) {
  const errors = [];

  if (!data.customerName || data.customerName.trim().length < 2) {
    errors.push('Customer name must be at least 2 characters.');
  }

  const cleanPhone = (data.phone || '').replace(/\D/g, '');
  if (!cleanPhone || cleanPhone.length !== 10) {
    errors.push('A valid 10-digit Indian mobile number is required.');
  }

  if (!data.address || data.address.trim().length < 5) {
    errors.push('A complete pickup address is required.');
  }

  if (!data.service) {
    errors.push('A laundry service must be selected.');
  }

  if (!data.pickupDate) {
    errors.push('A pickup date must be selected.');
  }

  if (!data.pickupTimeSlot) {
    errors.push('A pickup time slot must be selected.');
  }

  if (errors.length > 0) {
    const error = new Error(errors.join(' '));
    error.status = 400;
    throw error;
  }
}

/**
 * Create a new laundry pickup order
 * @param {Object} orderData
 * @returns {Promise<Object>} Created order document
 */
export async function createOrder(orderData) {
  // 1. Business validation
  validateOrderPayload(orderData);

  // 2. Generate unique tracking code
  const trackingId = await generateUniqueTrackingId();

  // 3. Normalize values
  const cleanPhone = orderData.phone.replace(/\D/g, '');
  const quantity = Math.max(1, Number(orderData.quantity) || 1);
  const estimatedPrice = Math.max(0, Number(orderData.estimatedPrice) || 0);

  // 4. Persistence
  const newOrder = await Order.create({
    trackingId,
    customerName: orderData.customerName.trim(),
    phone: cleanPhone,
    address: orderData.address.trim(),
    service: orderData.service.trim(),
    serviceId: orderData.serviceId || 'wash-fold',
    quantity,
    unit: orderData.unit || 'kg',
    estimatedPrice,
    currency: 'INR',
    pickupDate: orderData.pickupDate,
    pickupTimeSlot: orderData.pickupTimeSlot,
    specialInstructions: (orderData.specialInstructions || '').trim(),
    status: 'PICKUP_SCHEDULED',
  });

  return newOrder;
}

/**
 * Retrieve an order by its tracking ID
 * @param {string} trackingId 
 * @returns {Promise<Object|null>}
 */
export async function findOrderByTrackingId(trackingId) {
  if (!trackingId) {
    const err = new Error('Tracking ID is required');
    err.status = 400;
    throw err;
  }

  const normalizedId = trackingId.trim().toUpperCase();
  const order = await Order.findOne({ trackingId: normalizedId }).lean();
  return order;
}

/**
 * List orders for admin dashboard with search and filter
 * @param {Object} filters { search, status }
 */
export async function getAllOrdersAdmin({ search, status } = {}) {
  const query = {};

  if (status && status !== 'ALL' && VALID_ORDER_STATUSES.includes(status)) {
    query.status = status;
  }

  if (search && search.trim().length > 0) {
    const term = search.trim();
    query.$or = [
      { trackingId: { $regex: term, $options: 'i' } },
      { customerName: { $regex: term, $options: 'i' } },
      { phone: { $regex: term, $options: 'i' } },
      { address: { $regex: term, $options: 'i' } },
    ];
  }

  return await Order.find(query)
    .sort({ createdAt: -1 })
    .lean();
}

/**
 * Update an order's status
 * @param {string} orderId 
 * @param {string} newStatus 
 */
export async function updateOrderStatus(orderId, newStatus) {
  if (!newStatus || !VALID_ORDER_STATUSES.includes(newStatus)) {
    const err = new Error(
      `Invalid order status "${newStatus}". Must be one of: ${VALID_ORDER_STATUSES.join(', ')}`
    );
    err.status = 400;
    throw err;
  }

  const order = await Order.findById(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }

  order.status = newStatus;
  await order.save();
  return order;
}

/**
 * List recent orders (limited, for verification)
 */
export async function listRecentOrders(limit = 10) {
  return await Order.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}
