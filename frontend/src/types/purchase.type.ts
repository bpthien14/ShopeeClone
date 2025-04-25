import { purchasesStatus } from '@/constants/purchase'

export type PurchaseStatus = typeof purchasesStatus[keyof typeof purchasesStatus]
export type PurchaseListStatus = PurchaseStatus | typeof purchasesStatus.all

export interface Product {
  _id: string
  name: string
  photoUrls: string[]
}

export interface Merchant {
  _id: string
  name: string
  avatar: string
}

export interface PurchaseItem {
  product: string // ID của product
  name: string
  photoUrls: string[]
  quantity: string
  unitPrice: string
}

export interface Purchase {
  _id: string
  merchant: string // ID của merchant
  customerId: string
  items: PurchaseItem[]
  discountAmount: number
  shippingAmount: number
  shippingAddress: string
  status: PurchaseStatus
  createdAt?: string
  updatedAt?: string
} 