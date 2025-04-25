import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Cart from './cart.model';
import ApiError from '../errors/ApiError';
import { ICartDoc, ICartItem } from './cart.interfaces';
import Product from '../product/product.model';

export const getCart = async (userId: mongoose.Types.ObjectId): Promise<ICartDoc | null> => {
  // Step 1: Fetch the cart document
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  // Step 2: Get all product IDs from the cart
  const productIds = cart.items.map(item => item.productId);

  // Step 3: Fetch corresponding product data with merchant populated
  const products = await Product.find({ _id: { $in: productIds } })
    .populate("merchant", "name")
    .lean();

  // Step 4: Build a map for quick lookup
  const productMap = new Map<string, any>(
    products.map(p => [p._id.toString(), p])
  );

  // Step 5: Create enriched items
  const enrichedItems = cart.items.map(item => {
    const product = productMap.get(item.productId.toString());
    return {
      productId: item.productId,
      productName: product?.name || "Unknown Product",
      quantity: item.quantity,
      price: item.price,
      photoUrl: product?.photoUrls?.[0], // Get first photo
      merchant: product?.merchant 
        ? {
            _id: product.merchant._id,
            name: product.merchant.name
          }
        : undefined
    };
  });

  // Step 6: Create a new cart object with enriched items
  const enrichedCart = {
    _id: cart._id,
    userId: cart.userId,
    items: enrichedItems,
    totalAmount: cart.totalAmount
  };
  console.log("Enriched Cart: ", enrichedCart);
  return enrichedCart as ICartDoc;
};

export const addToCart = async (userId: mongoose.Types.ObjectId, item: ICartItem): Promise<ICartDoc> => {
  // Check stock first
  const product = await Product.findById(item.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  if (product.stockAmount < item.quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Only ${product.stockAmount} items available`);
  }

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
  // Check stock first
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found'+productId);
  }
  if (product.stockAmount < quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Only ${product.stockAmount} items available`);
  }

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