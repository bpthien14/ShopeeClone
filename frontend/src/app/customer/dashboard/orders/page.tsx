'use client';

import * as React from 'react';
import { useState } from 'react';
import purchaseApi from '@/apis/purchase.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { Purchase, PurchaseListStatus } from '@/types/purchase.type';

import { OrderItem } from './components/OrderItem';
import { OrderTabs } from './components/OrderTabs';

import './components/order-tracking.css';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<PurchaseListStatus | 'all'>('all');
  const queryClient = useQueryClient();
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    orderId: '',
  });

  // Fetch orders
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders', activeTab],
    queryFn: () => purchaseApi.getPurchases({ status: activeTab === 'all' ? undefined : activeTab }),
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: string) => purchaseApi.cancelPurchase(orderId),
    onSuccess: () => {
      toast.success('Hủy đơn hàng thành công');
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      toast.error('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
      console.error('Error cancelling order:', error);
    },
  });

  const handleCancelOrder = (orderId: string) => {
    setConfirmDialog({
      open: true,
      orderId,
    });
  };

  const confirmCancelOrder = () => {
    cancelOrderMutation.mutate(confirmDialog.orderId);
    setConfirmDialog({ open: false, orderId: '' });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, orderId: '' });
  };

  const orders = ordersData?.data.results || [];

  return (
    <div className="container">
      <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="orders-container">
        {isLoading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">Không có đơn hàng nào</div>
        ) : (
          orders.map((order: Purchase) => <OrderItem key={order._id} order={order} onCancelOrder={handleCancelOrder} />)
        )}
      </div>

      <Dialog open={confirmDialog.open} onClose={closeConfirmDialog}>
        <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="inherit">
            Không, giữ lại
          </Button>
          <Button onClick={confirmCancelOrder} variant="contained" color="error">
            Có, hủy đơn hàng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
