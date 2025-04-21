'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { OrderTabs } from './components/OrderTabs'
import { OrderItem } from './components/OrderItem'
import purchaseApi from '@/apis/purchase.api'
import { Purchase, PurchaseListStatus } from '@/types/purchase.type'
import { toast } from 'react-toastify'
import './components/order-tracking.css'

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<PurchaseListStatus | 'all'>('all')
  const queryClient = useQueryClient()

  // Fetch orders
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders', activeTab],
    queryFn: () => purchaseApi.getPurchases({ status: activeTab === 'all' ? undefined : activeTab })
  })

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: string) => purchaseApi.cancelPurchase(orderId),
    onSuccess: () => {
      toast.success('Hủy đơn hàng thành công')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: (error) => {
      toast.error('Không thể hủy đơn hàng. Vui lòng thử lại sau.')
      console.error('Error cancelling order:', error)
    }
  })

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      cancelOrderMutation.mutate(orderId)
    }
  }

  console.log('Raw API Response:', ordersData)
  const orders = ordersData?.data?.results || []
  console.log('Processed Orders:', orders)

  return (
    <div className="container">
      <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="orders-container">
        {isLoading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">Không có đơn hàng nào</div>
        ) : (
          orders.map((order: Purchase) => (
            <OrderItem key={order._id} order={order} onCancelOrder={handleCancelOrder} />
          ))
        )}
      </div>
    </div>
  )
}
