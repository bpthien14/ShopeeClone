import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Order from '../order.model';
import ApiError from '../../errors/ApiError';
import { IOptions, QueryResult } from '../../paginate/paginate';
import { IOrder, IOrderDoc, OrderStatus } from '../order.interfaces';
import { isValidStatusTransition } from '../utils/orderStatusTransition';

export const createOrder = async (orderData: IOrder): Promise<IOrderDoc> => {
    return Order.create(orderData);
  };
  
  /**
   * Query for customer orders
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
   * Cancel order
   * @param {mongoose.Types.ObjectId} orderId
   * @param {mongoose.Types.ObjectId} customerId
   * @returns {Promise<IOrderDoc>}
   */
  export const cancelOrder = async (
    orderId: mongoose.Types.ObjectId,
    customerId: mongoose.Types.ObjectId
  ): Promise<IOrderDoc> => {
    const order = await getOrderById(orderId);
    
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy đơn hàng');
    }
  
    // Kiểm tra quyền hủy đơn
    if (order.customerId.toString() !== customerId.toString()) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền hủy đơn hàng này');
    }
  
    // Kiểm tra chuyển trạng thái hợp lệ
    if (!isValidStatusTransition(order.status, OrderStatus.CANCELLED)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Không thể hủy đơn hàng ở trạng thái này'
      );
    }
  
    order.status = OrderStatus.CANCELLED;
    await order.save();
    return order;
  };

  /**
   * Complete order (confirm received)
   * @param {mongoose.Types.ObjectId} orderId
   * @param {mongoose.Types.ObjectId} customerId
   * @returns {Promise<IOrderDoc>}
   */
  export const completeOrder = async (
    orderId: mongoose.Types.ObjectId,
    customerId: mongoose.Types.ObjectId
  ): Promise<IOrderDoc> => {
    const order = await getOrderById(orderId);
    
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy đơn hàng');
    }
  
    // Kiểm tra quyền xác nhận đơn
    if (order.customerId.toString() !== customerId.toString()) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền xác nhận đơn hàng này');
    }
  
    // Kiểm tra chuyển trạng thái hợp lệ
    if (!isValidStatusTransition(order.status, OrderStatus.COMPLETED)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Không thể xác nhận đã nhận hàng ở trạng thái này'
      );
    }
  
    order.status = OrderStatus.COMPLETED;
    await order.save();
    return order;
  };