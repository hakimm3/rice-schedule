import { Router } from 'express';
import { 
  createTransaction, 
  getTransactions, 
  getTransactionById, 
  deleteTransaction 
} from '../controllers/transactionController';
import { authenticate } from '../middleware/authMiddleware';
import { upload } from '../utils/fileUpload';

const router = Router();

router.post('/', authenticate, upload.single('prove_image'), createTransaction);
router.get('/', authenticate, getTransactions);
router.get('/:id', authenticate, getTransactionById);
router.delete('/:id', authenticate, deleteTransaction);

export default router;
