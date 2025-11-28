import { Router } from 'express';
import { getUserQueue, getUserStats } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/queue', authenticate, getUserQueue);
router.get('/stats', authenticate, getUserStats);

export default router;
