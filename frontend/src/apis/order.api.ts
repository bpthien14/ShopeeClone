import axiosInstance from './axios';

export interface Order {
  _id: string;
  userId: string;
  customerName: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalAmount: number;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'cod' | 'card' | 'banking';
}

export interface OrderListResponse {
  results: Order[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface OrderParams {
  page?: number;
  limit?: number;
  status?: Order['status'];
}

export const getOrders = async (params: OrderParams = {}) => {
  const response = await axiosInstance.get<OrderListResponse>('/orders', { params });
  // Map _id to id in response
  const mappedOrders = response.data.results.map(order => ({
    ...order,
    id: order._id
  }));
  return {
    orders: mappedOrders,
    total: response.data.totalResults
  };
};

export const getOrderById = async (id: string) => {
  const response = await axiosInstance.get<Order>(`/orders/${id}`);
  return {
    ...response.data,
    id: response.data._id
  };
};

export const updateOrderStatus = async (id: string, status: Order['status']) => {
  const response = await axiosInstance.patch<Order>(`/orders/${id}`, { status });
  return {
    ...response.data,
    id: response.data._id
  };
};