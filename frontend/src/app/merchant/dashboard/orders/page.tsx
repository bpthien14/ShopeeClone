'use client';

import { Container, Typography, Box } from '@mui/material';
import { OrderList } from '@/components/dashboard/orders/order-list';

export default function OrdersPage() {
  return (
    <Container maxWidth={false}>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Orders
        </Typography>
        <OrderList />
      </Box>
    </Container>
  );
} 