import * as React from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { Order, updateOrderStatus } from '@/apis/order.api';

const statusLabels: Record<Order['status'], string> = {
  pending: 'Chờ xác nhận',
  approved: 'Đã xác nhận',
  shipping: 'Đang giao',
  shipped: 'Đã giao',
  completed: 'Hoàn thành',
};

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: Order['status'];
  onStatusChange: (newStatus: Order['status']) => void;
  onCancel: () => void;
}

export function OrderStatusSelect({
  orderId,
  currentStatus,
  onStatusChange,
  onCancel,
}: OrderStatusSelectProps) {
  const [selectedStatus, setSelectedStatus] = React.useState<Order['status'] | ''>('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [openConfirm, setOpenConfirm] = React.useState(false);

  const handleStatusChange = (event: any) => {
    const newStatus = event.target.value as Order['status'];
    setSelectedStatus(newStatus);
    setOpenConfirm(true);
  };

  const handleConfirm = async () => {
    if (!selectedStatus) return;

    setLoading(true);
    setError(null);

    try {
      await updateOrderStatus(orderId, selectedStatus);
      onStatusChange(selectedStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      setSelectedStatus('');
    } finally {
      setLoading(false);
      setOpenConfirm(false);
    }
  };

  const handleCancel = () => {
    setSelectedStatus('');
    setOpenConfirm(false);
    onCancel();
  };

  return (
    <>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth size="small">
          <Select
            value={selectedStatus || currentStatus}
            onChange={handleStatusChange}
            disabled={loading}
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <CircularProgress size={20} />
          </Box>
        )}
        {error && (
          <Typography color="error" variant="caption">
            {error}
          </Typography>
        )}
      </Box>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng từ{' '}
            <strong>{statusLabels[currentStatus]}</strong> thành{' '}
            <strong>{selectedStatus ? statusLabels[selectedStatus] : ''}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Hủy</Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 