"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type WhatsAppAssistantContextValue = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openAssistant: () => void;
};

const WhatsAppAssistantContext =
  createContext<WhatsAppAssistantContextValue | null>(null);

export function WhatsAppAssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openAssistant = useCallback(() => setIsOpen(true), []);

  return (
    <WhatsAppAssistantContext.Provider
      value={{ isOpen, setIsOpen, openAssistant }}
    >
      {children}
    </WhatsAppAssistantContext.Provider>
  );
}

export function useWhatsAppAssistant() {
  const context = useContext(WhatsAppAssistantContext);
  if (!context) {
    throw new Error(
      "useWhatsAppAssistant must be used within WhatsAppAssistantProvider",
    );
  }
  return context;
}
