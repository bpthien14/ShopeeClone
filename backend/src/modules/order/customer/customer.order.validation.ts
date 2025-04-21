import Joi from 'joi';
import { OrderStatus } from '../order.interfaces';

const getOrders = {
  query: Joi.object().keys({
    status: Joi.string().valid(...Object.values(OrderStatus)),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().required(),
  }),
};

const createOrder = {
  body: Joi.object().keys({
    items: Joi.array().items(
      Joi.object().keys({
        product: Joi.string().required(),
        quantity: Joi.number().required().min(1),
      })
    ).required(),
    shippingAddress: Joi.string().required(),
  }),
};

const cancelOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().required(),
  }),
};

export const customerOrderValidation = {
  getOrders,
  getOrder,
  createOrder,
  cancelOrder,
};