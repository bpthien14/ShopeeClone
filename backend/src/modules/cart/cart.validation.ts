import Joi from 'joi';
import { objectId } from '../validate/custom.validation';

const addToCart = {
  body: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
    productName: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    price: Joi.number().min(0).required(),
  }),
};

const getCart = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateCartItem = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    quantity: Joi.number().integer().min(1).required(),
  }),
};

const removeFromCart = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const clearCart = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

const checkout = {
  body: Joi.object().keys({
    customerName: Joi.string().required(),
    shippingAddress: Joi.object().keys({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
    paymentMethod: Joi.string().valid('cod', 'card', 'banking').required(),
  }),
};

export const cartValidation = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkout,
};