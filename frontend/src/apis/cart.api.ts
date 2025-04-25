import axiosInstance from './axios';
import { type Order } from './order.api';

export interface CartItem {
  productId: string; // Just the ID
  productName: string;
  quantity: number;
  price: number;
  photoUrl?: string; // Add this
  merchant?: {
    _id: string;
    name: string;
  }; // Add this
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
}

// Add interface for checkout data
export interface CheckoutData {
  shippingAddress: string;
}

export const getCart = async () => {
    const response = await axiosInstance.get<Cart>(`/cart`);
    return response.data;
};

export const addToCart = async (item: Omit<CartItem, 'userId'>) => {
  const response = await axiosInstance.post<Cart>('/cart', item);
  return response.data;
};

export const removeFromCart = async (productId: string) => {
  const response = await axiosInstance.delete<Cart>(`/cart/${productId}`);
  return response.data;
};

export const updateCartItemQuantity = async (productId: string, quantity: number) => {
  const response = await axiosInstance.patch<Cart>(`/cart/${productId}`, { quantity });
  return response.data;
};

export const checkoutCart = async (checkoutData: CheckoutData) => {
  const response = await axiosInstance.post('/cart/checkout', checkoutData);
  return response.data;
};