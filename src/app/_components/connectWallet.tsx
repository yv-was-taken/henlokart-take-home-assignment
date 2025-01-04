"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";
import { useState, useEffect } from "react";

export const ConnectWallet = () => {
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address: address,
  });

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <ConnectButton />

      {isConnected && address && (
        <div className="mt-4 rounded-lg border bg-gray-50 p-4">
          <p className="text-gray-700">Address: {formatAddress(address)}</p>
          {balanceData && (
            <p className="text-gray-700">
              Balance: {parseFloat(balanceData.formatted).toFixed(4)}{" "}
              {balanceData.symbol}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
