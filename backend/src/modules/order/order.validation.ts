import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { OrderStatus } from './order.interfaces';

const createOrder = {
  body: Joi.object().keys({
    customerId: Joi.string().custom(objectId).required(),
    items: Joi.array()
      .items(
        Joi.object().keys({
          product: Joi.string().custom(objectId).required(),
          name: Joi.string().required(),
          photoUrls: Joi.array().items(Joi.string().uri()).required(),
          quantity: Joi.string().required(),
          unitPrice: Joi.string().required(),
        })
      )
      .min(1)
      .required(),
    discountAmount: Joi.number().min(0).default(0),
    shippingAmount: Joi.number().min(0).default(0),
    shippingAddress: Joi.string().required(),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'approved', 'shipping', 'shipped', 'completed'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required(),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid('pending', 'approved', 'shipping', 'shipped', 'completed').required(),
    })
    .min(1),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required(),
  }),
};

const updateOrderStatus = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    status: Joi.string()
      .required()
      .valid(...Object.values(OrderStatus))
      .messages({
        'any.required': 'Trạng thái đơn hàng là bắt buộc',
        'string.valid': 'Trạng thái đơn hàng không hợp lệ',
      }),
  }),
};

export const orderValidation = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
}; 