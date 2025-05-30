"use client";

import DynamicMethods from "@/app/components/Methods";
import WorldMethods from "@/app/components/WorldMethods";
import { useDarkMode } from "@/lib/useDarkMode";
// import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
// import { MiniKit } from "@worldcoin/minikit-js";
import Image from "next/image";
import { useEffect, useState } from "react";
import "./page.css";
import { MiniKit } from "@worldcoin/minikit-js";

export default function Main() {
  const { isDarkMode } = useDarkMode();
  const [isMiniKitInstalled, setIsMiniKitInstalled] = useState<boolean | null>(
    null
  );
  const [nonce, setNonce] = useState<string | null>(null);
  const [nonceLoading, setNonceLoading] = useState(false);
  const [nonceError, setNonceError] = useState<string | null>(null);
  const [testData, setTestData] = useState<any>(null);
  const [testDataLoading, setTestDataLoading] = useState(false);

  useEffect(() => {
    // Check if MiniKit is installed
    console.log("Checking MiniKit installation...");
    const checkMiniKitInstallation = async () => {
      console.log("Checking MiniKit installation...");
      const isInstalled = await MiniKit.install();

      console.log("MiniKit installed:", isInstalled);

      setIsMiniKitInstalled(true);
    };

    checkMiniKitInstallation();
  }, [MiniKit]);

  const fetchNonce = async () => {
    setNonceLoading(true);
    setNonceError(null);

    const environmentId =
      process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID ||
      "9ca34db1-1322-40a5-9991-8eaeaecf7c6d";
    const options = { method: "GET" };

    try {
      const response = await fetch(
        `https://app.dynamicauth.com/api/v0/sdk/${environmentId}/nonce`,
        options
      );
      const data = await response.json();
      console.log("Nonce response:", data);
      setNonce(data.nonce);
    } catch (err) {
      console.error("Error fetching nonce:", err);
      setNonceError(
        err instanceof Error ? err.message : "Failed to fetch nonce"
      );
    } finally {
      setNonceLoading(false);
    }
  };

  const fetchTestData = async () => {
    setTestDataLoading(true);
    setTestData(null);

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos/1"
      );
      const data = await response.json();
      console.log("Test data:", data);
      setTestData(data);
    } catch (err) {
      console.error("Error fetching test data:", err);
    } finally {
      setTestDataLoading(false);
    }
  };

  return (
    <div className={`container ${isDarkMode ? "dark" : "light"}`}>
      <div className="header">
        <Image
          className="logo"
          src={isDarkMode ? "/logo-light.png" : "/logo-dark.png"}
          alt="dynamic"
          width="300"
          height="60"
        />{" "}
        <div className="header-buttons">
          <button
            className="docs-button"
            onClick={() =>
              window.open(
                "https://docs.dynamic.xyz",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            Docs
          </button>
          <button
            className="get-started"
            onClick={() =>
              window.open(
                "https://docs.world.org/mini-apps",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            World Docs
          </button>
        </div>
      </div>

      {isMiniKitInstalled === false && (
        <div className="warning-banner">
          This is a World Mini App. Please open it within the World App for full
          functionality.
        </div>
      )}

      <div className="modal">
        {/* <DynamicWidget /> */}
        <div className={`nonce-section ${isDarkMode ? "dark" : "light"}`}>
          <h3>Dynamic Nonce API</h3>
          <button
            className="nonce-button"
            onClick={fetchNonce}
            disabled={nonceLoading}
          >
            {nonceLoading ? "Fetching..." : "Get Nonce"}
          </button>
          {nonce && (
            <div className="nonce-result">
              <p>
                Nonce: <strong>{nonce}</strong>
              </p>
            </div>
          )}
          {nonceError && (
            <div className="nonce-error">
              <p>Error: {nonceError}</p>
            </div>
          )}
        </div>

        <div className={`test-data-section ${isDarkMode ? "dark" : "light"}`}>
          <h3>Test API</h3>
          <button
            className="test-data-button"
            onClick={fetchTestData}
            disabled={testDataLoading}
          >
            {testDataLoading ? "Fetching..." : "Fetch Test Data"}
          </button>
          {testData && (
            <div className="test-data-result">
              <h4>Response:</h4>
              <pre>{JSON.stringify(testData, null, 2)}</pre>
            </div>
          )}
        </div>

        <DynamicMethods isDarkMode={isDarkMode} />
        <WorldMethods isDarkMode={isDarkMode} />
      </div>

      <div className="footer">
        <div className="footer-text">Made with 💙 by Dynamic & World</div>
        <Image
          className="footer-image"
          src={isDarkMode ? "/image-dark.png" : "/image-light.png"}
          alt="dynamic"
          width="400"
          height="300"
        />
      </div>
    </div>
  );
}
