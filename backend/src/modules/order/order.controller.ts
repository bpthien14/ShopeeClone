import { Request, Response } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import * as orderService from './order.service';
import pick from '../utils/pick';
import { IOrder } from './order.interfaces';
import { IUserDoc } from '../user/user.interfaces';

interface CustomRequest extends Request {
  user?: IUserDoc;
}

export const createOrder = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }
  
  const orderData: IOrder = {
    ...req.body,
    userId: req.user._id,
  };
  const order = await orderService.createOrder(orderData);
  res.status(httpStatus.CREATED).send(order);
});

export const getOrders = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await orderService.queryOrders(filter, options);
  res.send(result);
});

export const getOrder = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['orderId'] !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order ID must be a string');
  }
  const order = await orderService.getOrderById(new mongoose.Types.ObjectId(req.params['orderId']));
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  res.send(order);
});

export const updateOrder = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['orderId'] !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order ID must be a string');
  }
  const order = await orderService.updateOrderStatus(
    new mongoose.Types.ObjectId(req.params['orderId']),
    req.body.status as IOrder['status']
  );
  res.send(order);
});

export const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['orderId'] !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order ID must be a string');
  }
  await orderService.deleteOrder(new mongoose.Types.ObjectId(req.params['orderId']));
  res.status(httpStatus.NO_CONTENT).send();
}); 