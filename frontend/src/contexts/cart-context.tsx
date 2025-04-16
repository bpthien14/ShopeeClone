'use client';

import * as React from 'react';
import { createContext, useContext, useCallback, useState } from 'react';
import { Cart, CartItem, getCart, addToCart, removeFromCart, updateCartItemQuantity } from '@/apis/cart.api';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (item: Omit<CartItem, 'userId'>) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateItemQuantity: (productId: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCart();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (item: Omit<CartItem, 'userId'>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await addToCart(item);
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await removeFromCart(productId);
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItemQuantity = useCallback(async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await updateCartItemQuantity(productId, quantity);
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        fetchCart,
        addItem,
        removeItem,
        updateItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}