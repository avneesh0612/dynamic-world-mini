"use client";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { config } from "@/lib/wagmi";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import { MiniKit } from "@worldcoin/minikit-js";
import { useState, useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const [isMiniKitInstalled, setIsMiniKitInstalled] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    // Check if MiniKit is installed
    const checkMiniKitInstallation = async () => {
      const isInstalled = await MiniKit.isInstalled();
      setIsMiniKitInstalled(isInstalled);
      console.log("MiniKit installed:", isInstalled);
    };

    checkMiniKitInstallation();
  }, []);

  useEffect(() => {
    // Dynamic import for client-side only
    import("eruda").then((eruda) => {
      eruda.default.init();
    });
  }, []);

  return (
    <DynamicContextProvider
      theme="auto"
      settings={{
        environmentId:
          process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID ||
          "9ca34db1-1322-40a5-9991-8eaeaecf7c6d",
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
