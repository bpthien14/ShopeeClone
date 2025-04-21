export const purchasesStatus = {
  inCart: -1, // Sản phẩm đang trong giỏ hàng
  all: 'all', // Tất cả sản phẩm
  waitForConfirmation: 'pending', // Đang chờ xác nhận
  waitForGetting: 'approved', // Đang lấy hàng
  inProgress: 'shipping', // Đang vận chuyển
  delivered: 'completed', // Đã giao
  cancelled: 'cancelled' // Đã hủy
} as const 