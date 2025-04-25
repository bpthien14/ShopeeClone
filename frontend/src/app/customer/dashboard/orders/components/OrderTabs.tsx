'use client'

import { purchasesStatus } from '@/constants/purchase'
import { PurchaseListStatus } from '@/types/purchase.type'

type TabId = PurchaseListStatus | 'all'

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: purchasesStatus.waitForConfirmation as PurchaseListStatus, label: 'Chờ thanh toán' },
  { id: purchasesStatus.inProgress as PurchaseListStatus, label: 'Vận chuyển' },
  { id: purchasesStatus.waitForGetting as PurchaseListStatus, label: 'Chờ giao hàng' },
  { id: purchasesStatus.delivered as PurchaseListStatus, label: 'Hoàn thành' },
  { id: purchasesStatus.cancelled as PurchaseListStatus, label: 'Đã hủy' }
]

interface OrderTabsProps {
  activeTab: TabId
  onTabChange: (tabId: TabId) => void
}

export function OrderTabs({ activeTab, onTabChange }: OrderTabsProps) {
  return (
    <div className="tabs-container">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
} 