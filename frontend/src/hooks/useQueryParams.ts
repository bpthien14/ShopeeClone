'use client'

import { useSearchParams } from 'next/navigation'

export default function useQueryParams() {
  const searchParams = useSearchParams()
  
  const params: { [key: string]: string } = {}
  if (searchParams) {
    searchParams.forEach((value, key) => {
      params[key] = value
    })
  }

  return params
} 