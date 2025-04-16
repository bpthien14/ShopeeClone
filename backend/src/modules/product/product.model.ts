import mongoose, { Schema } from 'mongoose';
import { paginate } from '../paginate';
import { IProductDoc, IProductModel } from './product.interfaces';

const ratingSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new Schema<IProductDoc, IProductModel>(
  {
    merchant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    comparePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    stockAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'draft'],
      default: 'draft',
    },
    photoUrls: [{
      type: String,
      required: true,
    }],
    ratings: [ratingSchema],
  },
  {
    timestamps: true,
  }
);

// Add indexes for common queries
productSchema.index({ merchant: 1 });
productSchema.index({ status: 1 });
productSchema.index({ 'ratings.rate': 1 });

// Add plugin for pagination
productSchema.plugin(paginate);

const Product = mongoose.model<IProductDoc, IProductModel>('Product', productSchema);

export default Product;