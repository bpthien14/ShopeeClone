'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/apis/product.api';
import { ProductList } from '@/components/dashboard/product/productList';
import { Container, Typography, Box, CircularProgress } from '@mui/material';

export default function ProductsPage() {
  // Fetch products with React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });
  
  // Ensure products is an array to prevent type errors
  const products = data || [];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">Có lỗi khi tải danh sách sản phẩm. Vui lòng thử lại sau.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth={false}>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Featured Products
        </Typography>
        {products && <ProductList products={products} />}
      </Box>
    </Container>
  );
}
