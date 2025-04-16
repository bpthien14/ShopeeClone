import axiosInstance from './axios';

export interface OrderItem {
  product: string; // objectId
  name: string;
  photoUrls: string[];
  quantity: string;
  unitPrice: string;
}

export interface Order {
  _id: string;
  merchant: string; // objectId
  customerId: string; // objectId
  items: OrderItem[];
  discountAmount: number;
  shippingAmount: number;
  shippingAddress: string;
  status: 'pending' | 'approved' | 'shipping' | 'shipped' | 'completed';
  createdAt: string;
  updatedAt: string;
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
  const response = await axiosInstance.get<OrderListResponse>('/orders/merchant', { params });
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