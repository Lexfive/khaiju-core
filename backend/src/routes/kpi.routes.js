import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import * as ctrl from '../controllers/kpi.controller.js';

const router = Router();
router.use(protect);
router.get('/', ctrl.getAll);
export default router;