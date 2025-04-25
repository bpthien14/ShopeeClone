import { Request, Response } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import * as cartService from './cart.service';
import ApiError from '../errors/ApiError';
import { IUserDoc } from '../user/user.interfaces';
import * as orderService from '../order/merchant/merchant.order.service';
import { OrderStatus } from '../order/order.interfaces';

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

  const cart = await cartService.updateCartItem(
    req.user._id,
    new mongoose.Types.ObjectId(req.params['productId']),
    req.body.quantity
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Cart updated successfully',
    data: cart
  });
});

export const clearCart = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const cart = await cartService.clearCart(req.user._id);
  res.status(httpStatus.OK).send(cart);
});

export const checkoutCart = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const cart = await cartService.getCart(req.user._id);
  if (!cart || cart.items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart is empty');
  }

  const now = new Date();

  // Transform cart items to order items format
  const orderItems = cart.items.map(item => ({
    product: item.productId,
    name: item.productName,
    photoUrls: item.photoUrl || [], // Provide empty array as fallback
    quantity: item.quantity.toString(),
    unitPrice: item.price.toString()
  }));

  // Check if cart has items and merchant info
  if (!cart.items[0]?.merchant?._id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid merchant information in cart');
  }

  // Create order from cart
  const order = await orderService.createOrder({
    merchant: cart.items[0].merchant._id, // You need to get the merchant ID from the product
    customerId: req.user._id,
    items: orderItems,
    discountAmount: 0,
    shippingAmount: 0,
    shippingAddress: req.body.shippingAddress,
    status: OrderStatus.PENDING,
    createdAt: now,
    updatedAt: now
  });

  // Clear the cart after successful order creation
  await cartService.clearCart(req.user._id);

  res.status(httpStatus.CREATED).send(order);
});