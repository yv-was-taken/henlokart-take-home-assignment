"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { BalanceDisplay } from "./BalanceDisplay";

export const ConnectWallet = () => {
  const { address, isConnected } = useAccount();

  return (
    <div className="flex flex-col items-center gap-2">
      <ConnectButton />
      {isConnected && address && <BalanceDisplay address={address} />}
    </div>
  );
};

export default ConnectWallet;
