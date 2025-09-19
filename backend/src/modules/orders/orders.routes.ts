import { Router } from 'express';
import { crudController } from '../common/crudFactory';
import { verifyJWT, requireAdmin } from '../../middleware/auth';

const { Order, Customer, OrderItem, Product } = require('../../db/models');
const router = Router();

const defaultInclude = [
    { model: Customer, as: 'customer', attributes: ['id', 'name', 'email'] },
    { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'sku', 'price'] }] },
];

const ctrl = crudController(Order, {
    listAllowedFilters: ['status', 'payment_method', 'customer_id'],
    defaultInclude,
    async beforeCreate(payload) {
        // Si vienen items, calcular total_amount
        if (Array.isArray(payload.items) && payload.items.length) {
            const items = payload.items;
            const total = items.reduce((acc: number, it: any) => acc + Number(it.unit_price) * Number(it.quantity), 0);
            payload.total_amount = total;
        }
        return payload;
    },
});

router.use(verifyJWT, requireAdmin);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
// Crear Order + items en una sola transacción opcional
router.post('/', async (req, res) => {
    const t = await Order.sequelize!.transaction();
    try {
        const { items = [], ...orderPayload } = req.body || {};
        const order = await Order.create(orderPayload, { transaction: t });


        if (Array.isArray(items) && items.length) {
            const bulk = items.map((i: any) => ({ ...i, order_id: order.id }));
            await OrderItem.bulkCreate(bulk, { transaction: t });
        }


        await t.commit();
        const created = await Order.findByPk(order.id, { include: defaultInclude });
        res.status(201).json({ data: created });
    } catch (err) {
        await t.rollback();
        res.status(400).json({ error: 'No se pudo crear la orden', details: (err as any)?.message });
    }
});
router.put('/:id', ctrl.update);
export default router;