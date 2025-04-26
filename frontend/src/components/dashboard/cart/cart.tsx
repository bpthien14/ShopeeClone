'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Minus, Plus, Trash } from '@phosphor-icons/react';

import { useCart } from '@/contexts/cart-context';

import { CheckoutDialog } from './checkout-dialog';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface CheckoutData {
  customerName: string;
  shippingAddress: string;
}

export function Cart() {
  const router = useRouter();
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [itemErrors, setItemErrors] = React.useState<Record<string, string>>({});
  const { cart, error, removeItem, updateItemQuantity, fetchCart, checkout } = useCart();

  React.useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  // Loading state check
  if (!cart) {
    return <Typography>Loading...</Typography>;
  }

  // Error state check
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Empty cart check
  if (!cart.items || cart.items.length === 0) {
    return <Typography>Your cart is empty</Typography>;
  }

  const handleQuantityChange = async (productId: string, quantity: number) => {
    try {
      setItemErrors((prev) => ({ ...prev, [productId]: '' }));
      await updateItemQuantity(productId, quantity);
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === 'object' && 'response' in err
          ? (err as ApiError).response?.data?.message || 'Failed to update quantity'
          : 'Failed to update quantity';

      setItemErrors((prev) => ({
        ...prev,
        [productId]: errorMessage,
      }));
    }
  };

  const handleCheckout = async (checkoutData: CheckoutData) => {
    try {
      // Gửi đầy đủ dữ liệu bao gồm customerName
      await checkout({
        customerName: checkoutData.customerName,
        shippingAddress: checkoutData.shippingAddress,
      });
      setCheckoutOpen(false);
      router.push('/customer/dashboard/orders');
    } catch (err) {
      console.error('Checkout failed:', err);
      const errorMessage =
        err && typeof err === 'object' && 'response' in err
          ? (err as ApiError).response?.data?.message || 'Checkout failed'
          : 'Checkout failed';
      alert(errorMessage);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Shopping Cart
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Merchant</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.items.map((item) => (
            <TableRow key={item.productId}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {item.photoUrl ? (
                    <Box
                      component="img"
                      src={item.photoUrl}
                      alt={item.productName}
                      sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
                    />
                  ) : null}
                  <Typography>{item.productName}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography>{item.merchant?.name || 'Unknown Merchant'}</Typography>
              </TableCell>
              <TableCell align="right">${item.price.toFixed(2)}</TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
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
                        void handleQuantityChange(item.productId, value);
                      }
                    }}
                    sx={{
                      width: 60,
                      mx: 1,
                      '& .MuiFormHelperText-root': {
                        position: 'absolute',
                        bottom: -20,
                        whiteSpace: 'nowrap',
                      },
                    }}
                    error={Boolean(itemErrors[item.productId])}
                    helperText={itemErrors[item.productId]}
                  />
                  <IconButton size="small" onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>
                    <Plus />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
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
          onClick={() => {
            setCheckoutOpen(true);
          }}
        >
          Proceed to Checkout
        </Button>
      </Box>
      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => {
          setCheckoutOpen(false);
        }}
        onCheckout={handleCheckout}
      />
    </Box>
  );
}
