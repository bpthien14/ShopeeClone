export interface SuccessResponse<Data> {
  message: string
  data: {
    results: Data
    page: number
    limit: number
    totalPages: number
    totalResults: number
  }
}

export interface ErrorResponse {
  message: string
  data?: any
} 