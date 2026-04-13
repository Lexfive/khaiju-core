import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import * as ctrl from '../controllers/category.controller.js';

const router = Router();
router.use(protect);
router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
export default router;