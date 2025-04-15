import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Order from './order.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IOrder, IOrderDoc } from './order.interfaces';

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

/**
 * Update order status
 * @param {mongoose.Types.ObjectId} orderId
 * @param {IOrder['status']} status
 * @returns {Promise<IOrderDoc>}
 */
export const updateOrderStatus = async (orderId: mongoose.Types.ObjectId, status: IOrder['status']): Promise<IOrderDoc> => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  order.status = status;
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