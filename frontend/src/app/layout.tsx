'use client'

import * as React from 'react';
import type { Viewport } from 'next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'react-toastify/dist/ReactToastify.css'

import '@/styles/global.css';

import { UserProvider } from '@/contexts/user-context';
import { CartProvider } from '@/contexts/cart-context';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

interface LayoutProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <UserProvider>
              <CartProvider>
                <ThemeProvider>{children}</ThemeProvider>
              </CartProvider>
              <ToastContainer />
            </UserProvider>
          </LocalizationProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
