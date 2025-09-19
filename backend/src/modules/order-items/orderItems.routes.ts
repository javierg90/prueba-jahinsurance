import { Router } from 'express';
import { crudController } from '../common/crudFactory';
import { verifyJWT, requireAdmin } from '../../middleware/auth';

const { OrderItem, Order, Product } = require('../../db/models');
const router = Router();
const ctrl = crudController(OrderItem, {
    listAllowedFilters: ['order_id', 'product_id'],
    defaultInclude: [
        { model: Order, as: 'order', attributes: ['id', 'status', 'payment_method'] },
        { model: Product, as: 'product', attributes: ['id', 'name', 'sku'] },
    ],
});


router.use(verifyJWT, requireAdmin);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);


export default router;