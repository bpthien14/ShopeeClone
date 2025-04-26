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
import { useUser } from '@/hooks/auth/use-user';

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  onCheckout: (data: CheckoutData) => Promise<void>;
}

export function CheckoutDialog({ open, onClose, onCheckout }: CheckoutDialogProps) {
  const {user} = useUser()

  const [checkoutData, setCheckoutData] = React.useState<CheckoutData>({
    shippingAddress: ''
  });

  React.useEffect(() => {
    if (user) setCheckoutData({
      ...checkoutData
    })
  },[user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void onCheckout(checkoutData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Checkout</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <TextField
                label="Shipping Address"
                fullWidth
                value={checkoutData.shippingAddress}
                onChange={(e) => {
                  setCheckoutData(prev => ({
                    ...prev,
                    shippingAddress: e.target.value
                  }));
                }}
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
