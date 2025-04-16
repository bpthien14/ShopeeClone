import { Request, Response } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import * as orderService from './order.service';
import pick from '../utils/pick';
import { IOrder } from './order.interfaces';
import { IUserDoc } from '../user/user.interfaces';
// import Order from './order.model';

interface CustomRequest extends Request {
  user?: IUserDoc;
}

export const createOrder = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }
  
  const orderData: IOrder = {
    ...req.body,
    merchant: req.user._id,
  };
  const order = await orderService.createOrder(orderData);
  res.status(httpStatus.CREATED).send(order);
});

export const getOrders = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const filter = {
    ...pick(req.query, ['status']),
    merchant: req.user._id.toString(),
  };
  const options = {
    ...pick(req.query, ['sortBy', 'limit', 'page']),
    projectBy: '-__v',
  };

  const result = await orderService.queryOrders(filter, options);
  res.send(result);
});

export const getOrder = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  if (typeof req.params['orderId'] !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order ID must be a string');
  }

  const order = await orderService.getOrderById(new mongoose.Types.ObjectId(req.params['orderId']));
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // Check if the order belongs to the merchant
  if (order.merchant.toString() !== req.user._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  res.send(order);
});

export const updateOrder = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  if (typeof req.params['orderId'] !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order ID must be a string');
  }

  const orderId = new mongoose.Types.ObjectId(req.params['orderId']);
  const order = await orderService.getOrderById(orderId);

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // Check if the order belongs to the merchant
  if (order.merchant.toString() !== req.user._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  const updatedOrder = await orderService.updateOrderStatus(orderId, req.body.status, req.user._id);
  res.send(updatedOrder);
});

export const updateOrderStatus = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  if (typeof req.params['orderId'] !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order ID must be a string');
  }

  const orderId = new mongoose.Types.ObjectId(req.params['orderId']);
  const { status } = req.body;

  const updatedOrder = await orderService.updateOrderStatus(orderId, status, req.user._id);
  res.send(updatedOrder);
});

export const deleteOrder = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  if (typeof req.params['orderId'] !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order ID must be a string');
  }

  const orderId = new mongoose.Types.ObjectId(req.params['orderId']);
  const order = await orderService.getOrderById(orderId);

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // Check if the order belongs to the merchant
  if (order.merchant.toString() !== req.user._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  await orderService.deleteOrder(orderId);
  res.status(httpStatus.NO_CONTENT).send();
}); 