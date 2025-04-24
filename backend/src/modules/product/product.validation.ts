import Joi from "joi";
import { Order } from "../order";
import { objectId } from "../validate";
import  Product  from "./product.model";


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
};