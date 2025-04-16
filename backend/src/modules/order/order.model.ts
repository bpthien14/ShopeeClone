import mongoose, { Schema } from 'mongoose';
import { paginate } from '../paginate';
import { IOrderDoc, IOrderModel, OrderStatus } from './order.interfaces';

const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    photoUrls: {
      type: [String],
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new Schema<IOrderDoc, IOrderModel>(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    discountAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    }
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(paginate);

const Order = mongoose.model<IOrderDoc, IOrderModel>('Order', orderSchema);

export default Order; 