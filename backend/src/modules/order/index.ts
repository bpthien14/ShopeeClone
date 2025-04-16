import * as orderController from './order.controller';
import * as orderService from './order.service';
import Order from './order.model';
import { orderValidation } from './order.validation';

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
} from './order.controller';

export {
  createOrder as createOrderService,
  queryOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder as deleteOrderService,
} from './order.service'; 