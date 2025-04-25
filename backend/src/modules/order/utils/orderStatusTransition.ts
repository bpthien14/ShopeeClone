import { OrderStatus } from '../order.interfaces';

// Định nghĩa các trạng thái chuyển đổi hợp lệ
const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.APPROVED, OrderStatus.CANCELLED], // Từ pending có thể chuyển sang approved hoặc cancelled
  [OrderStatus.APPROVED]: [OrderStatus.SHIPPING, OrderStatus.CANCELLED], // Từ approved có thể chuyển sang shipping hoặc cancelled
  [OrderStatus.SHIPPING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED], // Từ shipping có thể chuyển sang shipped hoặc cancelled
  [OrderStatus.SHIPPED]: [OrderStatus.COMPLETED], // Từ shipped chỉ có thể chuyển sang completed
  [OrderStatus.COMPLETED]: [], // Từ completed không thể chuyển sang trạng thái khác
  [OrderStatus.CANCELLED]: [OrderStatus.REFUNDED], // Từ cancelled có thể chuyển sang refunded
  [OrderStatus.REFUNDED]: [], // Từ refunded không thể chuyển sang trạng thái khác
};

/**
 * Kiểm tra xem việc chuyển đổi trạng thái có hợp lệ không
 * @param currentStatus Trạng thái hiện tại
 * @param newStatus Trạng thái mới
 * @returns boolean
 */
export const isValidStatusTransition = (
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean => {
  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

/**
 * Lấy danh sách trạng thái có thể chuyển đổi từ trạng thái hiện tại
 * @param currentStatus Trạng thái hiện tại
 * @returns OrderStatus[]
 */
export const getValidNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
  return validTransitions[currentStatus] || [];
}; 