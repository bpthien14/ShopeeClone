'use client';

import * as React from 'react';
import { getProductById } from '@/apis/product.api';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import ProductDetail from '@/components/dashboard/product/product-detail';

export default function ProductPage({ params }: { params: { id: string } }) {
  // Sử dụng React Query để fetch dữ liệu sản phẩm
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', params.id],
    queryFn: () => getProductById(params.id),
  });

  // Debug log để kiểm tra cấu trúc dữ liệu từ API
  console.log('Product data:', apiResponse);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !apiResponse || !apiResponse.data) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">Không tìm thấy sản phẩm hoặc có lỗi xảy ra.</Typography>
      </Box>
    );
  }

  // Trích xuất dữ liệu sản phẩm từ response của API
  const product = apiResponse.data;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ProductDetail product={product} />
    </Container>
  );
}
