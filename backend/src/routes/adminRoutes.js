import { Router } from 'express';
import { login, getProfile } from '../controllers/authController.js';
import {
  getAllPlans,
  createPlan,
  updatePlan,
  togglePlanStatus,
  deletePlan,
} from '../controllers/planController.js';
import {
  getAllOrdersAdmin,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = Router();

// 1. Admin Authentication Route (Public to Admin credentials)
router.post('/login', login);

// 2. Protected Admin Profile Check
router.get('/me', requireAdminAuth, getProfile);

// 3. Protected Plan / Service Management
router.get('/plans', requireAdminAuth, getAllPlans);
router.post('/plans', requireAdminAuth, createPlan);
router.put('/plans/:id', requireAdminAuth, updatePlan);
router.patch('/plans/:id/status', requireAdminAuth, togglePlanStatus);
router.delete('/plans/:id', requireAdminAuth, deletePlan);

// 4. Protected Booking & Order Management
router.get('/orders', requireAdminAuth, getAllOrdersAdmin);
router.patch('/orders/:id/status', requireAdminAuth, updateOrderStatus);

export default router;
