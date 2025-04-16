import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    paymentMethod: 'cod',
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
                label="Street Address"
                value={checkoutData.shippingAddress.street}
                onChange={(e) => { setCheckoutData(prev => ({
                  ...prev,
                  shippingAddress: {
                    ...prev.shippingAddress,
                    street: e.target.value
                  }
                })); }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="City"
                value={checkoutData.shippingAddress.city}
                onChange={(e) => { setCheckoutData(prev => ({
                  ...prev,
                  shippingAddress: {
                    ...prev.shippingAddress,
                    city: e.target.value
                  }
                })); }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="State"
                value={checkoutData.shippingAddress.state}
                onChange={(e) => { setCheckoutData(prev => ({
                  ...prev,
                  shippingAddress: {
                    ...prev.shippingAddress,
                    state: e.target.value
                  }
                })); }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="ZIP Code"
                value={checkoutData.shippingAddress.zipCode}
                onChange={(e) => { setCheckoutData(prev => ({
                  ...prev,
                  shippingAddress: {
                    ...prev.shippingAddress,
                    zipCode: e.target.value
                  }
                })); }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Country"
                value={checkoutData.shippingAddress.country}
                onChange={(e) => { setCheckoutData(prev => ({
                  ...prev,
                  shippingAddress: {
                    ...prev.shippingAddress,
                    country: e.target.value
                  }
                })); }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={checkoutData.paymentMethod}
                  onChange={(e) => { setCheckoutData(prev => ({
                    ...prev,
                    paymentMethod: e.target.value as CheckoutData['paymentMethod']
                  })); }}
                  label="Payment Method"
                >
                  <MenuItem value="cod">Cash on Delivery</MenuItem>
                  <MenuItem value="card">Credit Card</MenuItem>
                  <MenuItem value="banking">Bank Transfer</MenuItem>
                </Select>
              </FormControl>
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