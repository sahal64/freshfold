import { Router } from 'express';
import {
  createOrder,
  getOrderByTrackingId,
  getRecentOrders,
} from '../controllers/orderController.js';

const router = Router();

// Endpoint to list recent orders (for testing/verification)
router.get('/', getRecentOrders);

// Endpoint to create a new order
router.post('/', createOrder);

// Endpoint to look up order status by tracking ID
router.get('/:trackingId', getOrderByTrackingId);

export default router;
