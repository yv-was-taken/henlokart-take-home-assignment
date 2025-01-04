"use client";

import { useState, useEffect } from "react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createConfig, WagmiProvider, deserialize, serialize } from "wagmi";
import { http } from "viem";
import { base } from "wagmi/chains";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";

// 1. Import modules.
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

// 2. Create a new Query Client with a default `gcTime`.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 24, // 24 hours
    },
  },
});

// 3. Set up the persister.
const persister = createSyncStoragePersister({
  serialize,
  storage: window.localStorage,
  deserialize,
});

const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

const { connectors } = getDefaultWallets({
  appName: "My Web3 App",
  projectId: "YOUR_PROJECT_ID", // Get this from WalletConnect Cloud
  chains: wagmiConfig.chains,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <RainbowKitProvider chains={wagmiConfig.chains}>
          {mounted && children}
        </RainbowKitProvider>
      </PersistQueryClientProvider>
    </WagmiProvider>
  );
}
