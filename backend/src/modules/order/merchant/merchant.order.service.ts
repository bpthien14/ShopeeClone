import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Order from '../order.model';
import ApiError from '../../errors/ApiError';
import { IOptions, QueryResult } from '../../paginate/paginate';
import { IOrder, IOrderDoc, OrderStatus } from '../order.interfaces';

/**
 * Create an order
 * @param {IOrder} orderBody
 * @returns {Promise<IOrderDoc>}
 */
export const createOrder = async (orderBody: IOrder): Promise<IOrderDoc> => {
  return Order.create(orderBody);
};

/**
 * Query for orders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryOrders = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const orders = await Order.paginate(filter, options);
  return orders;
};

/**
 * Get order by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IOrderDoc | null>}
 */
export const getOrderById = async (id: mongoose.Types.ObjectId): Promise<IOrderDoc | null> => {
  return Order.findById(id);
};

const isValidStatusTransition = (currentStatus: OrderStatus, newStatus: OrderStatus): boolean => {
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.APPROVED, OrderStatus.COMPLETED, OrderStatus.CANCELLED],
    [OrderStatus.APPROVED]: [OrderStatus.SHIPPING, OrderStatus.COMPLETED, OrderStatus.CANCELLED],
    [OrderStatus.SHIPPING]: [OrderStatus.SHIPPED, OrderStatus.COMPLETED],
    [OrderStatus.SHIPPED]: [OrderStatus.COMPLETED, OrderStatus.REFUNDED],
    [OrderStatus.COMPLETED]: [],
    [OrderStatus.CANCELLED]: [],
    [OrderStatus.REFUNDED]: []
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

/**
 * Update order status
 * @param {mongoose.Types.ObjectId} orderId
 * @param {IOrder['status']} status
 * @returns {Promise<IOrderDoc>}
 */
export const updateOrderStatus = async (
  orderId: mongoose.Types.ObjectId,
  newStatus: OrderStatus,
  merchantId: mongoose.Types.ObjectId
): Promise<IOrderDoc> => {
  const order = await getOrderById(orderId);
  
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy đơn hàng');
  }

  // Kiểm tra quyền cập nhật
  if (order.merchant.toString() !== merchantId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền cập nhật đơn hàng này');
  }

  // Kiểm tra chuyển trạng thái hợp lệ
  if (!isValidStatusTransition(order.status, newStatus)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Không thể chuyển trạng thái từ ${order.status} sang ${newStatus}`
    );
  }

  order.status = newStatus;
  await order.save();
  return order;
};

/**
 * Delete order by id
 * @param {mongoose.Types.ObjectId} orderId
 * @returns {Promise<IOrderDoc>}
 */
export const deleteOrder = async (orderId: mongoose.Types.ObjectId): Promise<IOrderDoc> => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  await order.deleteOne();
  return order;
}; 