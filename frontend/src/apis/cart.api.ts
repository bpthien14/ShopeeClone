import axiosInstance from './axios';
import { Order } from './order.api';

export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
}

// Add interface for checkout data
export interface CheckoutData {
  customerName: string;
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

export const checkoutCart = async (checkoutData: CheckoutData): Promise<Order> => {
  const response = await axiosInstance.post<Order>('/cart/checkout', {
    shippingAddress: checkoutData.shippingAddress
  });
  return response.data;
};