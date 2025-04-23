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
import { useRouter } from 'next/navigation';


interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function Cart() {
  const router = useRouter();
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [itemErrors, setItemErrors] = React.useState<Record<string, string>>({});
  const { cart, loading, error, removeItem, updateItemQuantity, fetchCart } = useCart();

  React.useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  // Loading state first
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  // Error state second
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Check for null cart first
  if (!cart) {
    return <Typography>Loading cart...</Typography>;
  }

  // Then check for empty cart
  if (cart.items.length === 0) {
    return <Typography>Your cart is empty</Typography>;
  }

  const handleQuantityChange = async (productId: string, quantity: number) => {
    try {
      // Clear any existing errors for this item
      setItemErrors(prev => ({ ...prev, [productId]: '' }));
      
      // Try to update quantity
      await updateItemQuantity(productId, quantity);
    } catch (err: unknown) {
      // Show error but keep current cart state
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? ((err as ApiError).response?.data?.message || 'Failed to update quantity')
        : 'Failed to update quantity';
        
      setItemErrors(prev => ({ 
        ...prev, 
        [productId]: errorMessage 
      }));

      // Prevent the TextField from updating on error
      const currentItem = cart?.items.find(item => item.productId === productId);
      if (currentItem) {
        await updateItemQuantity(productId, currentItem.quantity);
      }
    }
  };

  const handleCheckout = async () => {
    try {
      await fetchCart(); // Refresh cart after successful checkout
      setCheckoutOpen(false);
      
      // Redirect back to cart page (it will show empty cart)
      router.push('/customer/dashboard/cart');
    } catch (err) {
      console.error('Checkout failed:', err);
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
                        whiteSpace: 'nowrap'
                      }
                    }}
                    error={Boolean(itemErrors[item.productId])}
                    helperText={itemErrors[item.productId]}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
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