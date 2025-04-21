import { Document, Model, Types } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export enum OrderStatus {
  PENDING = 'pending', // Chờ xử lý
  APPROVED = 'approved', // Đã xác nhận
  SHIPPING = 'shipping', // Đang giao hàng
  SHIPPED = 'shipped', // Đã giao hàng
  COMPLETED = 'completed', // Hoàn thành
  CANCELLED = 'cancelled', // Đã hủy
  REFUNDED = 'refunded' // Đã hoàn tiền
}

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  photoUrls: string[];
  quantity: string;
  unitPrice: string;
}

export interface IOrder {
  merchant: Types.ObjectId;
  customerId: Types.ObjectId;
  items: IOrderItem[];
  discountAmount: number;
  shippingAmount: number;
  shippingAddress: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderDoc extends IOrder, Document {}

export interface IOrderModel extends Model<IOrderDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
} 