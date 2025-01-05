"use client";

import { useAccount, useBalance } from "wagmi";
import { api } from "~/trpc/react";

interface BalanceDisplayProps {
  address: string;
}

export const BalanceDisplay = ({ address }: BalanceDisplayProps) => {
  const { isConnected } = useAccount();

  const { data: balanceData } = useBalance({
    address: address,
  });

  const { data: henloBalance } = api.getUserHenloBalance.getBalance.useQuery(
    {
      address: address || "",
    },
    { enabled: !!address && isConnected },
  );

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="mt-4 space-y-2 rounded-lg border bg-gray-50 p-4">
      <p className="text-gray-700">Address: {formatAddress(address)}</p>
      {balanceData && (
        <p className="text-gray-700">
          ETH Balance: {parseFloat(balanceData.formatted).toFixed(4)}{" "}
          {balanceData.symbol}
        </p>
      )}
      {henloBalance?.success && (
        <p className="text-gray-700">
          HENLO Balance: {parseFloat(henloBalance.balance).toFixed(4)} HENLO
        </p>
      )}
    </div>
  );
};
