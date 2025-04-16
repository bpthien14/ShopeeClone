import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { orderValidation } from '../../modules/order';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} from '../../modules/order';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(orderValidation.createOrder), createOrder)
  .get(auth(), validate(orderValidation.getOrders), getOrders);

router
  .route('/:orderId')
  .get(auth(), validate(orderValidation.getOrder), getOrder)
  .patch(auth(), validate(orderValidation.updateOrder), updateOrder)
  .delete(auth(), validate(orderValidation.deleteOrder), deleteOrder);

export default router; 