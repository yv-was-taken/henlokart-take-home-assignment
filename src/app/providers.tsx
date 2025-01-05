"use client";

import { useState, useEffect } from "react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createConfig, WagmiProvider, deserialize, serialize } from "wagmi";
import { http } from "viem";
import { base } from "wagmi/chains";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "../utils/trpc";
import superjson from "superjson";

export function Providers({ children }: { children: React.ReactNode }) {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
        }),
      ],
    }),
  );

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 1_000 * 60 * 60 * 24, // 24 hours
          },
        },
      }),
  );

  const [persister] = useState(() => {
    if (typeof window === "undefined") return undefined;

    return createSyncStoragePersister({
      serialize,
      storage: window.localStorage,
      deserialize,
    });
  });

  const wagmiConfig = createConfig({
    chains: [base],
    transports: {
      [base.id]: http(),
    },
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <WagmiProvider config={wagmiConfig}>
          <RainbowKitProvider chains={wagmiConfig.chains}>
            {mounted && children}
          </RainbowKitProvider>
        </WagmiProvider>
      </PersistQueryClientProvider>
    </trpc.Provider>
  );
}
