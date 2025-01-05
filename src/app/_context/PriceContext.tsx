"use client";

import { createContext, useContext, useEffect, useState } from "react";

type PriceContextType = {
  ethPrice: number;
};

const PriceContext = createContext<PriceContextType | undefined>(undefined);

export function PriceProvider({ children }: { children: React.ReactNode }) {
  const [ethPrice, setEthPrice] = useState(2000); // Starting price at $2000

  useEffect(() => {
    const updatePrice = () => {
      const randomChange = Math.floor(Math.random() * 6) + 3; // Random number between 3-8
      const direction = Math.random() > 0.5 ? 1 : -1; // Randomly decide plus or minus

      setEthPrice((prev) => prev + randomChange * direction);
    };

    // Update immediately on mount
    updatePrice();

    // Then update every 5 seconds
    const interval = setInterval(updatePrice, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PriceContext.Provider value={{ ethPrice }}>
      {children}
    </PriceContext.Provider>
  );
}

export function usePrice() {
  const context = useContext(PriceContext);
  if (context === undefined) {
    throw new Error("usePrice must be used within a PriceProvider");
  }
  return context;
}
