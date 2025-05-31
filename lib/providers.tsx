"use client";

import { config } from "@/lib/wagmi";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import { useEffect } from "react";
import { WagmiProvider } from "wagmi";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  useEffect(() => {
    import("eruda").then((eruda) => {
      eruda.default.init();
    });
  }, []);

  return (
    <DynamicContextProvider
      theme="auto"
      settings={{
        environmentId: "9ca34db1-1322-40a5-9991-8eaeaecf7c6d",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <MiniKitProvider>{children}</MiniKitProvider>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
