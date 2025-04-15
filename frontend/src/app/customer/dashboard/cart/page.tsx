'use client';
import * as React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Cart } from '@/components/dashboard/cart/cart';

export default function CartPage() {
  return (
    <Container maxWidth={false}>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>
        <Cart />
      </Box>
    </Container>
  );
}