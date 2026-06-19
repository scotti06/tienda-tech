"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addCartItem,
  getCartTotals,
  readCartFromStorage,
  removeCartItem,
  setCartItemQuantity,
  writeCartToStorage,
  type CartItem,
  type CartProductInput,
} from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  total: number;
  addItem: (product: CartProductInput, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readCartFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeCartToStorage(items);
  }, [items, hydrated]);

  const addItem = useCallback((product: CartProductInput, quantity = 1) => {
    setItems((current) => addCartItem(current, product, quantity));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => removeCartItem(current, id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) => setCartItemQuantity(current, id, quantity));
  }, []);

  const totals = useMemo(() => getCartTotals(items), [items]);

  const value = useMemo(
    () => ({
      items,
      totalItems: totals.totalItems,
      subtotal: totals.subtotal,
      total: totals.total,
      addItem,
      removeItem,
      updateQuantity,
    }),
    [items, totals, addItem, removeItem, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}
