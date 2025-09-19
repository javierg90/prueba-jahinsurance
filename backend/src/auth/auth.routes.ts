import { Router } from 'express';
import { AuthController } from './auth.controller';
import { verifyJWT } from '../middleware/auth';
const router = Router();

router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.get('/me', verifyJWT, AuthController.me);
router.post('/logout', verifyJWT, AuthController.logout);

export default router;
