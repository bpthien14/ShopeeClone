import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Cart from './cart.model';
import ApiError from '../errors/ApiError';
import { ICartDoc, ICartItem } from './cart.interfaces';

export const getCart = async (userId: mongoose.Types.ObjectId): Promise<ICartDoc | null> => {
  return Cart.findOne({ userId });
};

export const addToCart = async (userId: mongoose.Types.ObjectId, item: ICartItem): Promise<ICartDoc> => {
  const cart = await Cart.findOne({ userId });
  
  if (!cart) {
    return Cart.create({
      userId,
      items: [item],
      totalAmount: item.price * item.quantity
    });
  }

  const existingItem = cart.items.find(
    (i: { productId: { toString: () => string; }; }) => i.productId.toString() === item.productId.toString()
  );

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.items.push(item);
  }

  cart.totalAmount = cart.items.reduce((total: number, item: { price: number; quantity: number; }) => total + item.price * item.quantity, 0);
  await cart.save();
  return cart;
};

export const removeFromCart = async (userId: mongoose.Types.ObjectId, productId: mongoose.Types.ObjectId): Promise<ICartDoc> => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  cart.items = cart.items.filter((item: { productId: { toString: () => string; }; }) => item.productId.toString() !== productId.toString());
  cart.totalAmount = cart.items.reduce((total: number, item: { price: number; quantity: number; }) => total + item.price * item.quantity, 0);
  
  await cart.save();
  return cart;
};

export const updateCartItemQuantity = async (
  userId: mongoose.Types.ObjectId,
  productId: mongoose.Types.ObjectId,
  quantity: number
): Promise<ICartDoc> => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  const item = cart.items.find((i: { productId: { toString: () => string; }; }) => i.productId.toString() === productId.toString());
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found in cart');
  }

  item.quantity = quantity;
  cart.totalAmount = cart.items.reduce((total: number, item: { price: number; quantity: number; }) => total + item.price * item.quantity, 0);
  
  await cart.save();
  return cart;
};

export const updateCartItem = async (
  userId: mongoose.Types.ObjectId,
  productId: mongoose.Types.ObjectId,
  quantity: number
): Promise<ICartDoc> => {
  const cart = await Cart.findOne({ userId });
  
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  // Type the item properly
  const item = cart.items.find((item: ICartItem) => 
    item.productId.toString() === productId.toString()
  );

  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found in cart');
  }

  item.quantity = quantity;
  cart.totalAmount = cart.items.reduce(
    (total: number, item: ICartItem) => total + item.price * item.quantity,
    0
  );

  await cart.save();
  return cart;
};

export const clearCart = async (userId: mongoose.Types.ObjectId): Promise<ICartDoc> => {
  const cart = await Cart.findOne({ userId });
  
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  cart.items = [];
  cart.totalAmount = 0;

  await cart.save();
  return cart;
};