import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { type CheckoutData } from '@/apis/cart.api';

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  onCheckout: (data: CheckoutData) => Promise<void>;
}

export function CheckoutDialog({ open, onClose, onCheckout }: CheckoutDialogProps) {
  const [checkoutData, setCheckoutData] = React.useState<CheckoutData>({
    customerName: '',
    shippingAddress: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCheckout(checkoutData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Name"
                value={checkoutData.customerName}
                onChange={(e) => { setCheckoutData(prev => ({
                  ...prev,
                  customerName: e.target.value
                })); }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Shipping Address"
                value={checkoutData.shippingAddress}
                onChange={(e) => { setCheckoutData(prev => ({
                  ...prev,
                  shippingAddress: e.target.value
                })); }}
                multiline
                rows={3}
                placeholder="Enter your complete shipping address"
                required
              />
            </Grid>
            
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Place Order
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}