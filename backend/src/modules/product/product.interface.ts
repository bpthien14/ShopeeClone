import { Document, Model, Types } from 'mongoose';
 import { QueryResult } from '../paginate/paginate';
 
 export interface IProductRating {
   customerId: Types.ObjectId;
   orderId: Types.ObjectId;
   description: string;
   rate: number;
 }
 
 export interface IProduct {
   merchant: Types.ObjectId;
   name: string;
   description: string;
   unitPrice: number;
   comparePrice: number;
   stockAmount: number;
   status: 'active' | 'draft';
   photoUrls: string[];
   ratings: IProductRating[];
   createdAt: Date;
   updatedAt: Date;
 }
 
 export interface IProductDoc extends IProduct, Document {}
 
 export interface IProductModel extends Model<IProductDoc> {
   paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
 }