import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { orderValidation } from '../../modules/order/order.validation';
import { orderController } from '../../modules/order';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(orderValidation.createOrder), orderController.createOrder);
  
router
  .route('/merchant')  
  .get(auth(), validate(orderValidation.getOrders), orderController.getOrders);

router
  .route('/:orderId')
  .get(auth(), validate(orderValidation.getOrder), orderController.getOrder)
  .patch(auth(), validate(orderValidation.updateOrderStatus), orderController.updateOrderStatus)
  .delete(auth(), validate(orderValidation.deleteOrder), orderController.deleteOrder);

export default router; 