/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express';
import { crudController } from '../common/crudFactory';
import { verifyJWT, requireAdmin } from '../../middleware/auth';

const { Product } = require('../../db/models');
const router = Router();
const ctrl = crudController(Product, { listAllowedFilters: ['name', 'sku', 'category'] });

router.use(verifyJWT, requireAdmin);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);


export default router;