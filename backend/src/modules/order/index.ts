import * as orderController from './merchant/merchant.order.controller';
import * as orderService from './merchant/merchant.order.service';
import Order from './order.model';
import { orderValidation } from './merchant/merchant.order.validation';

export {
  Order,
  orderController,
  orderService,
  orderValidation,
};

export {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} from './merchant/merchant.order.controller';

export {
  createOrder as createOrderService,
  queryOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder as deleteOrderService,
} from './merchant/merchant.order.service'; 