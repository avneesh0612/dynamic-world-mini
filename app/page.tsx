"use client";

import { DynamicWidget } from "@/lib/dynamic";
import { useState, useEffect } from "react";
import DynamicMethods from "@/app/components/Methods";
import WorldMethods from "@/app/components/WorldMethods";
import { useDarkMode } from "@/lib/useDarkMode";
import "./page.css";
import Image from "next/image";
import { MiniKit } from "@worldcoin/minikit-js";

export default function Main() {
  const { isDarkMode } = useDarkMode();
  const [isMiniKitAvailable, setIsMiniKitAvailable] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    // Check if MiniKit is available
    const checkMiniKit = async () => {
      try {
        const isInstalled = await MiniKit.isInstalled();
        console.log("MiniKit installed:", isInstalled);
        setIsMiniKitAvailable(isInstalled);
      } catch (error) {
        console.error("Error checking MiniKit availability:", error);
        setIsMiniKitAvailable(false);
      }
    };

    checkMiniKit();
  }, []);

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

      {isMiniKitAvailable === false && (
        <div className="warning-banner">
          This is a World Mini App. Please open it within the World App for full
          functionality.
        </div>
      )}

      <div className="modal">
        <DynamicWidget />
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
