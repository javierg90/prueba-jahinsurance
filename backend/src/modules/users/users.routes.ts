import { Router } from 'express';
import { crudController } from '../common/crudFactory';
import bcrypt from 'bcryptjs';
import { body } from 'express-validator';
import { verifyJWT, requireAdmin } from '../../middleware/auth';

const { db, User } = require('../../db/models');
const router = Router();
const ctrl = crudController(User, {
    listAllowedFilters: ['email', 'role'],
    async beforeCreate(payload) {
        if (payload.password) payload.password_hash = bcrypt.hashSync(payload.password, 10);
        delete payload.password;
        return payload;
    },
    async beforeUpdate(payload) {
        if (payload.password) payload.password_hash = bcrypt.hashSync(payload.password, 10);
        delete payload.password;
        return payload;
    },
});

router.use(verifyJWT, requireAdmin);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/',
    body('email').isEmail(),
    body('role').optional().isString(),
    body('password').isLength({ min: 8 }),
    (req, res, next) => {
        // Manejo básico de validación
        const errors = (req as any).validationErrors?.();
        next();
    },
    ctrl.create
);
router.put('/:id', ctrl.update);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;