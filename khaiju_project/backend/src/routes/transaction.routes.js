import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import * as ctrl from '../controllers/transaction.controller.js';

const router = Router();
router.use(protect);
router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.deleteOne);
export default router;