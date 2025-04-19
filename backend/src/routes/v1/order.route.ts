import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { orderValidation } from '../../modules/order/order.validation';
import { createOrder, getOrders, getOrder, updateOrderStatus, deleteOrder } from '../../modules/order/order.controller';

const router: Router = express.Router();

// Merchant routes
router
  .route('/merchant')
  .post(auth() as express.RequestHandler, validate(orderValidation.createOrder), createOrder)
  .get(auth() as express.RequestHandler, validate(orderValidation.getOrders), getOrders);

router
  .route('/merchant/:orderId')
  .get(auth() as express.RequestHandler, validate(orderValidation.getOrder), getOrder)
  .patch(auth() as express.RequestHandler, validate(orderValidation.updateOrderStatus), updateOrderStatus)
  .delete(auth() as express.RequestHandler, validate(orderValidation.deleteOrder), deleteOrder);

// Customer routes
router
  .route('/customer')
  .get(auth() as express.RequestHandler, validate(orderValidation.getOrders), getOrders);

router
  .route('/customer/:orderId')
  .get(auth() as express.RequestHandler, validate(orderValidation.getOrder), getOrder);

export default router; 