'use client'

import Image from 'next/image'
import { MessageSquare, Info, ShoppingBag } from 'lucide-react'
import { Purchase } from '@/types/purchase.type'
import { formatCurrency } from '@/utils/utils'

interface OrderItemProps {
  order: Purchase
  onCancelOrder: (orderId: string) => void
}

export function OrderItem({ order, onCancelOrder }: OrderItemProps) {
  return (
    <div className="order-item">
      <div className="seller-info">
        <div className="seller-left">
          <span className="favorite-button favorite-plus">Yêu thích+</span>
          <span className="seller-name">{order.merchant}</span>
          <button className="chat-button">
            <MessageSquare size={16} />
            Chat
          </button>
          <button className="view-shop-button">
            <ShoppingBag size={16} />
            Xem Shop
          </button>
        </div>
        <div className="order-status">
          <span className={`status-${order.status}`}>{order.status}</span>
          <Info size={16} className="info-icon" />
          <span className="status-waiting">{getStatusLabel(String(order.status))}</span>
        </div>
      </div>

      {order.items.map((item) => (
        <div key={item.product} className="product-item">
          <div className="product-image">
            {item.photoUrls?.[0] && (
              <Image 
                src={item.photoUrls[0]} 
                alt={item.name} 
                width={96} 
                height={96} 
                className="object-cover"
              />
            )}
          </div>
          <div className="product-details">
            <h3 className="product-title">{item.name}</h3>
            {/* <p className="product-category">Phân loại hàng: {item.product.category}</p> */}
            <p className="product-quantity">x{item.quantity}</p>
          </div>
          <div className="product-price">
            <p className="original-price">₫{formatCurrency(Number(item.unitPrice) * 1.2)}</p>
            <p className="discounted-price">{formatCurrency(Number(item.unitPrice))}</p>
          </div>
        </div>
      ))}

      <div className="order-footer">
        <p className="order-note">
          Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao đến bạn và sản phẩm nhận được không có vấn đề
          nào.
        </p>
        <div className="order-total">
          <span className="total-label">Tổng số tiền:</span>
          <span className="total-price">
            {formatCurrency(
              order.items.reduce((total, item) => total + Number(item.unitPrice) * Number(item.quantity), 0) +
                order.shippingAmount -
                order.discountAmount
            )}
          </span>
        </div>
      </div>

      <div className="order-actions">
        {order.status === 'pending' && (
          <button className="cancel-button" onClick={() => onCancelOrder(order._id)}>
            Hủy đơn hàng
          </button>
        )}
        <button className="contact-seller-button">Liên Hệ Người Bán</button>
      </div>
    </div>
  )
}

function getStatusMessage(status: string) {
  switch (status) {
    case 'waitForConfirmation':
      return 'Đang chờ xác nhận'
    case 'waitForGetting':
      return 'Đang lấy hàng'
    case 'inProgress':
      return 'Đang vận chuyển'
    case 'delivered':
      return 'Giao hàng thành công'
    case 'cancelled':
      return 'Đã hủy'
    default:
      return status
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'waitForConfirmation':
      return 'CHỜ XÁC NHẬN'
    case 'waitForGetting':
      return 'ĐANG LẤY HÀNG'
    case 'inProgress':
      return 'ĐANG VẬN CHUYỂN'
    case 'delivered':
      return 'ĐÃ GIAO'
    case 'cancelled':
      return 'ĐÃ HỦY'
    default:
      return status.toUpperCase()
  }
} 