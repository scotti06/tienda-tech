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
  itemCount: number;
  subtotal: number;
  total: number;
  hydrated: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: CartProductInput, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setItems(readCartFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeCartToStorage(items);
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((open) => !open), []);

  const addItem = useCallback((product: CartProductInput, quantity = 1) => {
    setItems((current) => addCartItem(current, product, quantity));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => removeCartItem(current, id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) => setCartItemQuantity(current, id, quantity));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totals = useMemo(() => getCartTotals(items), [items]);

  const value = useMemo(
    () => ({
      items,
      totalItems: totals.totalItems,
      itemCount: totals.totalItems,
      subtotal: totals.subtotal,
      total: totals.total,
      hydrated,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      totals,
      hydrated,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ],
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
