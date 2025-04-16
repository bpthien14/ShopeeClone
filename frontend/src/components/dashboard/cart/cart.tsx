'use client';

import * as React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import { Trash, Plus, Minus } from '@phosphor-icons/react';
import { useCart } from '@/contexts/cart-context';
import { CheckoutDialog } from './checkout-dialog';
import { checkoutCart, type CheckoutData } from '@/apis/cart.api';
import { useRouter } from 'next/navigation';

export function Cart() {
  const router = useRouter();
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const { cart, loading, error, removeItem, updateItemQuantity, fetchCart } = useCart();
  
  React.useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  const handleCheckout = async (checkoutData: CheckoutData) => {
    try {
      const order = await checkoutCart(checkoutData);
      // Refresh cart after successful checkout
      await fetchCart();
      // Close checkout dialog
      setCheckoutOpen(false);
      // Redirect to order confirmation page
      router.push(`/customer/dashboard/orders/${order._id}`);
    } catch (err) {
      console.error('Checkout failed:', err);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!cart || cart.items.length === 0) {
    return <Typography>Your cart is empty</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Shopping Cart
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.items.map((item) => (
            <TableRow key={item.productId}>
              <TableCell>{item.productName}</TableCell>
              <TableCell align="right">${item.price.toFixed(2)}</TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus />
                  </IconButton>
                  <TextField
                    size="small"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        void updateItemQuantity(item.productId, value);
                      }
                    }}
                    sx={{ width: 60, mx: 1 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                  >
                    <Plus />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="right">
                ${(item.price * item.quantity).toFixed(2)}
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => removeItem(item.productId)} color="error">
                  <Trash />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3} align="right">
              <Typography variant="subtitle1">Total:</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle1">${cart.totalAmount.toFixed(2)}</Typography>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => { setCheckoutOpen(true); }}
        >
          Proceed to Checkout
        </Button>
      </Box>
      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => { setCheckoutOpen(false); }}
        onCheckout={handleCheckout}
      />
    </Box>
  );
}