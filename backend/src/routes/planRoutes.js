import { Router } from 'express';
import { getActivePlans } from '../controllers/planController.js';

const router = Router();

// Public endpoint for active services on the website
router.get('/', getActivePlans);

export default router;
