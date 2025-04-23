import axiosInstance from "./axios";

export interface ProductRating {
   customerId: string;
   orderId: string
   description: string;
   rate: number;
 }
 
 export interface Product {
   _id: string;
   slug: string;
   merchant: string;
   name: string;
   description: string;
   unitPrice: number;
   comparePrice: number;
   stockAmount: number;
   status: 'active' | 'draft';
   photoUrls: string[];
   ratings: ProductRating[];
   createdAt: Date;
   updatedAt: Date;
 }
 export interface RatingData {
  description: string;
  rate: number;
}

interface ReviewResponse {
  message: string;
  data: RatingData;
}
export const getProducts = async () => {
    const response = await axiosInstance.get<Product>(`/products`);
    return response.data;
};

export const getProductById = async (id: string) => {
    const response = await axiosInstance.get<Product>(`/products/${id}`);
    return response.data;
};

export const createProduct = async (product: Product) => {
    const response = await axiosInstance.post<Product>(`/products`, product);
    return response.data;
};

export const updateProduct = async (id: string, product: Product) => {
    const response = await axiosInstance.put<Product>(`/products/${id}`, product);
    return response.data;
};

export const deleteProduct = async (id: string) => {
    const response = await axiosInstance.delete<Product>(`/products/${id}`);
    return response.data;
};

export const getProductsByMerchant = async (merchantId: string) => {
    const response = await axiosInstance.get<Product>(`/products/merchant/${merchantId}`);
    return response.data;
};

export const getProductsByCategory = async (category: string) => {
    const response = await axiosInstance.get<Product>(`/products/category/${category}`);
    return response.data;
};

export const getProductsBySearch = async (searchTerm: string) => {
    const response = await axiosInstance.get<Product>(`/products/search/${searchTerm}`);
    return response.data;
};



export const addProductReview = async (productId: string, data: RatingData): Promise<ReviewResponse> => {
  const response = await axiosInstance.post<ReviewResponse>(`/products/${productId}/reviews`, data);
  return response.data;
};