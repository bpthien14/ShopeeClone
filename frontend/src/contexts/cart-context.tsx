'use client';

import * as React from 'react';
import { createContext, useContext, useCallback, useState } from 'react';
import { Cart, CartItem, getCart, addToCart, removeFromCart, updateCartItemQuantity as cartApiUpdateCartItemQuantity } from '@/apis/cart.api';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<Cart | null>;
  addItem: (item: Omit<CartItem, 'userId'>) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateItemQuantity: (productId: string, quantity: number) => Promise<Cart>;
  setCart: (cart: Cart | null) => void;
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
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
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

  const updateItemQuantity = async (productId: string, quantity: number) => {
    try {
      const response = await cartApiUpdateCartItemQuantity(productId, quantity);
      if (response.data) {
        setCart(response.data);
      }
    } catch (error) {
      if (error instanceof Error && 'response' in error) {
        throw error;
      }
      throw new Error('Failed to update cart');
    }
  };

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
        setCart,
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