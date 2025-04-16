import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
import { AccessAndRefreshTokens } from '../token/token.interfaces';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'merchant' | 'customer';
  photoUrl?: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  shop?: {
    name: string;
  };
  customerClass?: string;
  amountPaid: number;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateUserBody = Partial<IUser>;

export type NewRegisteredUser = Omit<IUser, 'photoUrl' | 'isEmailVerified'>;

export type NewCreatedUser = Omit<IUser, 'photoUrl' | 'isEmailVerified'>;

export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;
}