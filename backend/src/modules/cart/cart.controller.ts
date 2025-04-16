import { Request, Response } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import * as cartService from './cart.service';
import ApiError from '../errors/ApiError';
import { IUserDoc } from '../user/user.interfaces';

interface CustomRequest extends Request {
  user?: IUserDoc;
}

export const getCart = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }
  const cart = await cartService.getCart(req.user._id);
  res.send(cart);
});

export const addToCart = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }
  const cart = await cartService.addToCart(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(cart);
});

export const removeFromCart = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }
  const cart = await cartService.removeFromCart(
    req.user._id,
    new mongoose.Types.ObjectId(req.params['productId'])
  );
  res.send(cart);
});

export const updateCartItemQuantity = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }
  const cart = await cartService.updateCartItemQuantity(
    req.user._id,
    new mongoose.Types.ObjectId(req.params['productId']),
    req.body.quantity
  );
  res.send(cart);
});

export const updateCartItem = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const productId = new mongoose.Types.ObjectId(req.params['productId']);
  const { quantity } = req.body;

  const cart = await cartService.updateCartItem(
    req.user._id,
    productId,
    quantity
  );

  res.status(httpStatus.OK).send(cart);
});

export const clearCart = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const cart = await cartService.clearCart(req.user._id);
  res.status(httpStatus.OK).send(cart);
});