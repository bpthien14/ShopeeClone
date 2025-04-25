import { Document, Model, Types } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface ICartItem {
  productId: Types.ObjectId;
  productName: string;
  quantity: number;
  price: number;
  merchant?: {
    _id: Types.ObjectId;
    name: string;
  };
  photoUrl?: string;
}

export interface ICart {
  userId: Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
}

export interface ICartDoc extends ICart, Document {}

export interface ICartModel extends Model<ICartDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}