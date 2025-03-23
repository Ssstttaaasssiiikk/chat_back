import { Router } from 'express';
import { verifyToken } from '../middlewares/authMiddlewares';
import { fetchAllConversationsByUserId } from '../controllers/coversationsController';

const router = Router();

router.get('/', verifyToken, fetchAllConversationsByUserId);

export default router;