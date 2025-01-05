"use client";

import { usePrice } from "../_context/PriceContext";

export const EthPrice = () => {
  const { ethPrice } = usePrice();

  return (
    <div className="text-2xl font-bold">
      ETH Price: ${ethPrice.toLocaleString()}
    </div>
  );
};
