import { Purchase, PurchaseListStatus } from '@/types/purchase.type'
import { SuccessResponse } from '@/types/utils.type'
import axiosInstance from './axios'

const URL = 'orders/customer'

const purchaseApi = {
  getPurchases(params: { status?: PurchaseListStatus }) {
    const queryParams = params.status === 'all' ? {} : params
    return axiosInstance.get<SuccessResponse<Purchase[]>>(URL, {
      params: queryParams
    })
  },
  getPurchaseDetail(purchaseId: string) {
    return axiosInstance.get<SuccessResponse<Purchase>>(`${URL}/${purchaseId}`)
  },
  cancelPurchase(purchaseId: string) {
    return axiosInstance.patch<SuccessResponse<Purchase>>(`${URL}/${purchaseId}`, {
      status: 'cancelled'
    })
  }
}

export default purchaseApi 