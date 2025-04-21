import express, { Router, RequestHandler } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { orderValidation } from '../../modules/order/merchant/merchant.order.validation';
import { createOrder, getOrders, getOrder, updateOrderStatus, deleteOrder } from '../../modules/order/merchant/merchant.order.controller';
import { customerOrderValidation } from '../../modules/order/customer/customer.order.validation';
import { 
  createCustomerOrder, 
  getCustomerOrders, 
  getCustomerOrder, 
  cancelCustomerOrder 
} from '../../modules/order/customer/customer.order.controller';

const router: Router = express.Router();

// Merchant routes
router
  .route('/merchant')
  .post(auth() as RequestHandler, validate(orderValidation.createOrder), createOrder)
  .get(auth() as RequestHandler, validate(orderValidation.getOrders), getOrders);

router
  .route('/merchant/:orderId')
  .get(auth() as RequestHandler, validate(orderValidation.getOrder), getOrder)
  .patch(auth() as RequestHandler, validate(orderValidation.updateOrderStatus), updateOrderStatus)
  .delete(auth() as RequestHandler, validate(orderValidation.deleteOrder), deleteOrder);

// Customer routes
router
  .route('/customer')
  .post(auth() as RequestHandler, validate(customerOrderValidation.createOrder), createCustomerOrder as unknown as RequestHandler)
  .get(auth() as RequestHandler, validate(customerOrderValidation.getOrders), getCustomerOrders as unknown as RequestHandler);

router
  .route('/customer/:orderId')
  .get(auth() as RequestHandler, validate(customerOrderValidation.getOrder), getCustomerOrder as unknown as RequestHandler)
  .patch(auth() as RequestHandler, validate(customerOrderValidation.cancelOrder), cancelCustomerOrder as unknown as RequestHandler);

export default router; 