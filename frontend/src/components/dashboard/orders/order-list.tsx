'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  IconButton,
  Chip,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import { PencilSimple } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Order, OrderParams, getOrders } from '@/apis/order.api';
import { OrderStatusSelect } from './OrderStatusSelect';

const statusColors: Record<Order['status'], 'default' | 'primary' | 'warning' | 'info' | 'success' | 'error'> = {
  pending: 'default',
  approved: 'primary',
  shipping: 'warning',
  shipped: 'info',
  completed: 'success',
  cancelled: 'error'
};

const statusLabels: Record<Order['status'], string> = {
  pending: 'Chờ xác nhận',
  approved: 'Đã xác nhận',
  shipping: 'Đang giao',
  shipped: 'Đã giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy'
};

export function OrderList() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [status, setStatus] = React.useState<Order['status'] | ''>('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editingOrderId, setEditingOrderId] = React.useState<string | null>(null);

  const fetchOrders = React.useCallback(async (params: OrderParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders(params);
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch orders');
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const params: OrderParams = {
      page: page + 1,
      limit: rowsPerPage,
      ...(status && { status }),
    };
    fetchOrders(params);
  }, [fetchOrders, page, rowsPerPage, status]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (event: any) => {
    setStatus(event.target.value);
    setPage(0);
  };

  const handleOrderStatusChange = (orderId: string, newStatus: Order['status']) => {
    const params: OrderParams = {
      page: page + 1,
      limit: rowsPerPage,
      ...(status && { status }),
    };
    fetchOrders(params);
    setEditingOrderId(null);
  };

  const handleEditClick = (orderId: string) => {
    setEditingOrderId(orderId);
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
  };

  const calculateTotal = (order: Order) => {
    const itemsTotal = order.items.reduce((sum, item) => {
      return sum + (Number(item.quantity) * Number(item.unitPrice));
    }, 0);
    return itemsTotal - order.discountAmount + order.shippingAmount;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: 'error.main', p: 2 }}>
        Error: {error}
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={status}
            label="Trạng thái"
            onChange={handleStatusChange}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="pending">Chờ xác nhận</MenuItem>
            <MenuItem value="approved">Đã xác nhận</MenuItem>
            <MenuItem value="shipping">Đang giao</MenuItem>
            <MenuItem value="shipped">Đã giao</MenuItem>
            <MenuItem value="completed">Hoàn thành</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.customerId}</TableCell>
                  <TableCell>
                    <Box>
                      {order.items.map((item, index) => (
                        <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                          {item.name} x {item.quantity}
                        </Typography>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(calculateTotal(order))}
                  </TableCell>
                  <TableCell>
                    {editingOrderId === order._id ? (
                      <OrderStatusSelect
                        orderId={order._id}
                        currentStatus={order.status}
                        onStatusChange={(newStatus) => handleOrderStatusChange(order._id, newStatus)}
                        onCancel={handleCancelEdit}
                      />
                    ) : (
                      <Chip
                        label={statusLabels[order.status]}
                        color={statusColors[order.status]}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(order._id)}
                      disabled={editingOrderId === order._id}
                    >
                      <PencilSimple />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có đơn hàng nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} trên ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </TableContainer>
    </Box>
  );
} 