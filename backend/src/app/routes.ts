import { Router } from 'express';
import authRoutes from '../auth/auth.routes';
import users from '../modules/users/users.routes';
import customers from '../modules/customers/customers.routes';
import products from '../modules/products/products.routes';
import orders from '../modules/orders/orders.routes';
import orderItems from '../modules/order-items/orderItems.routes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/users', users);
router.use('/customers', customers);
router.use('/products', products);
router.use('/orders', orders);
router.use('/order-items', orderItems);

export default router;