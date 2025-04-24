import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box,
  Typography,
} from '@mui/material';
import { RatingData } from '@/apis/product.api';

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RatingData) => Promise<void>;
}

export function ReviewDialog({ open, onClose, onSubmit }: ReviewDialogProps) {
  const [rating, setRating] = React.useState<number>(0);
  const [description, setDescription] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a review description');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        rate: rating,
        description: description.trim()
      });
      onClose();
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'response' in err && 
        err.response && typeof err.response === 'object' && 'data' in err.response && 
        err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
        ? String(err.response.data.message)
        : 'Failed to submit review';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography component="legend">Rating</Typography>
              <Rating
                value={rating}
                onChange={(_, value) => {
                  setRating(value || 0);
                  setError('');
                }}
              />
            </Box>
            <TextField
              fullWidth
              label="Review"
              multiline
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError('');
              }}
              error={Boolean(error)}
              helperText={error}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            Submit Review
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}