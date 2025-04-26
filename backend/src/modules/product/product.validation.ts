import Joi from "joi";
import { Order } from "../order";
import { objectId } from "../validate";
import  Product  from "./product.model";
import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be greater than 0"), // Match with frontend
  comparePrice: z.number().min(0, "Compare price must be greater than 0"),
  quantity: z.number().min(0, "Quantity must be greater than 0"), // Match with frontend
  status: z.enum(['active', 'draft']),
  photoUrls: z.array(z.string().url("Invalid URL format")).min(1, "At least one photo is required")
})

export type CreateProductInput = z.infer<typeof createProductSchema>

const addReview = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    description: Joi.string().required().trim(),
    rate: Joi.number().integer().min(1).max(5).required(),
  }).external(async (value: any, helpers: any) => {
    try {
      const { productId } = helpers.state.ancestors[1].params;
      const customerId = helpers.state.ancestors[1].user._id;

      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return helpers.error('any.invalid', { 
          message: 'Product not found' 
        });
      }

      // Check if user has completed order for this product
      const completedOrder = await Order.findOne({
        customerId,
        'items.product': productId,
        status: 'completed'
      });

      if (!completedOrder) {
        return helpers.error('any.invalid', { 
          message: 'You must have purchased and received this product to review it' 
        });
      }

      // Check if user has already reviewed this product
      const hasReviewed = product.ratings.some(
        rating => rating.customerId.toString() === customerId.toString()
      );

      if (hasReviewed) {
        return helpers.error('any.invalid', { 
          message: 'You have already reviewed this product' 
        });
      }

      // Return validated data with orderId
      return { 
        ...value, 
        orderId: completedOrder._id,
        productId 
      };
    } catch (error) {
      return helpers.error('any.invalid', { 
        message: 'Error validating review' 
      });
    }
  }),
};

export const productValidation = {
  addReview,
  updateSingleProduct: {
    params: z.object({
      productId: z.string().min(1, 'Product ID is required')
    }),
    body: z.object({
      name: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      price: z.number().min(0).optional(),
      comparePrice: z.number().min(0).optional(),
      quantity: z.number().min(0).optional(),
      status: z.enum(['active', 'draft']).optional(),
      photoUrls: z.array(z.string().url()).min(1).optional()
    })
  },

  deleteOneProduct: {
    params: z.object({
      productId: z.string().min(1, 'Product ID is required')
    })
  }
};