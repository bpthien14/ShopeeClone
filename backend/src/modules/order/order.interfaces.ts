import { Document, Model, Types } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IOrderItem {
  productId: Types.ObjectId;
  productName: string;
  quantity: number;
  price: number;
}

export interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IOrder {
  userId: Types.ObjectId;
  customerName: string;
  orderDate: Date;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress?: IShippingAddress;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'cod' | 'card' | 'banking';
}

export interface IOrderDoc extends IOrder, Document {}

export interface IOrderModel extends Model<IOrderDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
} 