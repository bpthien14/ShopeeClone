import Joi from 'joi';
import { objectId } from '../validate/custom.validation';

const createOrder = {
  body: Joi.object().keys({
    customerName: Joi.string().required(),
    items: Joi.array()
      .items(
        Joi.object().keys({
          productId: Joi.string().custom(objectId).required(),
          productName: Joi.string().required(),
          quantity: Joi.number().integer().min(1).required(),
          price: Joi.number().min(0).required(),
        })
      )
      .min(1)
      .required(),
    totalAmount: Joi.number().min(0).required(),
    shippingAddress: Joi.object().keys({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
    }),
    paymentMethod: Joi.string().valid('cod', 'card', 'banking').required(),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'processing', 'completed', 'cancelled'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid('pending', 'processing', 'completed', 'cancelled').required(),
    })
    .min(1),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

export const orderValidation = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
}; 