"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type VariantImageContextValue = {
  overrideImage: string | null;
  setOverrideImage: (image: string | null) => void;
};

const VariantImageContext = createContext<VariantImageContextValue | null>(null);

export function VariantImageProvider({ children }: { children: ReactNode }) {
  const [overrideImage, setOverrideImage] = useState<string | null>(null);

  return (
    <VariantImageContext.Provider value={{ overrideImage, setOverrideImage }}>
      {children}
    </VariantImageContext.Provider>
  );
}

export function useVariantImageOverride() {
  return useContext(VariantImageContext);
}
