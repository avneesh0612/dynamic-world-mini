"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import {
  VerifyCommandInput,
  VerificationLevel,
  PayCommandInput,
  Tokens,
  tokenToDecimals,
  SignMessageInput,
} from "@worldcoin/minikit-js";
import { useState } from "react";

interface WorldMethodsProps {
  isDarkMode: boolean;
}

export default function WorldMethods({ isDarkMode }: WorldMethodsProps) {
  const [result, setResult] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const safeStringify = (obj: unknown): string => {
    const seen = new WeakSet();
    return JSON.stringify(
      obj,
      (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return "[Circular]";
          }
          seen.add(value);
        }
        return value;
      },
      2
    );
  };

  function clearResult() {
    setResult("");
  }

  const verifyWithWorld = async () => {
    try {
      setIsVerifying(true);
      const verifyPayload: VerifyCommandInput = {
        action: "dynamic-world-app-verification", // This should match your action ID in Developer Portal
        signal: "0x123", // Optional additional data
        verification_level: VerificationLevel.Orb, // Orb | Device
      };

      if (!(await MiniKit.isInstalled())) {
        setResult(
          "MiniKit is not installed. Please open this app in World App."
        );
        return;
      }

      const { finalPayload } = await MiniKit.commandsAsync.verify(
        verifyPayload
      );

      if (finalPayload.status === "error") {
        setResult(`Error: Verification failed`);
        return;
      }

      setResult(safeStringify(finalPayload));

      // In a real app, you would verify the proof in your backend
      // const verificationResponse = await fetch('/api/verify', { ... });
    } catch (error) {
      setResult(`Verification error: ${safeStringify(error)}`);
    } finally {
      setIsVerifying(false);
    }
  };

  // Send a transaction implementation
  const sendTransaction = async () => {
    try {
      setIsSending(true);

      if (!(await MiniKit.isInstalled())) {
        setResult(
          "MiniKit is not installed. Please open this app in World App."
        );
        return;
      }

      // Example transaction - this would be a real contract interaction in production
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: "0x9Cf4F011F55Add3ECC1B1B497A3e9bd32183D6e8", // Example contract address
            abi: [
              {
                inputs: [
                  {
                    internalType: "address",
                    name: "recipient",
                    type: "address",
                  },
                ],
                name: "mintToken",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
              },
            ],
            functionName: "mintToken",
            args: ["0x126f7998Eb44Dd2d097A8AB2eBcb28dEA1646AC8"], // Example recipient address
          },
        ],
      });

      if (finalPayload.status === "error") {
        setResult(`Error sending transaction: Transaction failed`);
        return;
      }

      setTransactionId(finalPayload.transaction_id);
      setResult(`Transaction sent. ID: ${finalPayload.transaction_id}`);
    } catch (error) {
      setResult(`Transaction error: ${safeStringify(error)}`);
    } finally {
      setIsSending(false);
    }
  };

  // Make a payment implementation
  const makePayment = async () => {
    try {
      setIsPaying(true);

      if (!(await MiniKit.isInstalled())) {
        setResult(
          "MiniKit is not installed. Please open this app in World App."
        );
        return;
      }

      // In a real app, you would get this reference ID from your backend
      const paymentReference = Math.random().toString(36).substring(2, 15);

      const paymentPayload: PayCommandInput = {
        reference: paymentReference,
        to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // Example recipient address
        tokens: [
          {
            symbol: Tokens.WLD,
            token_amount: tokenToDecimals(0.1, Tokens.WLD).toString(), // 0.1 WLD
          },
        ],
        description: "Test payment from Dynamic World App",
      };

      const { finalPayload } = await MiniKit.commandsAsync.pay(paymentPayload);

      if (finalPayload.status === "error") {
        setResult(`Payment error: Payment failed`);
        return;
      }

      setResult(`Payment sent. Transaction ID: ${finalPayload.transaction_id}`);

      // In a real app, you would verify the payment in your backend
      // const paymentVerification = await fetch('/api/confirm-payment', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(finalPayload),
      // });
    } catch (error) {
      setResult(`Payment error: ${safeStringify(error)}`);
    } finally {
      setIsPaying(false);
    }
  };

  const checkMiniKitStatus = async () => {
    try {
      const isInstalled = await MiniKit.isInstalled();
      setResult(`MiniKit installed: ${isInstalled}`);
    } catch (error) {
      setResult(`Error checking MiniKit status: ${safeStringify(error)}`);
    }
  };

  // Sign a message implementation
  const signMessage = async () => {
    try {
      setIsSigning(true);

      if (!(await MiniKit.isInstalled())) {
        setResult(
          "MiniKit is not installed. Please open this app in World App."
        );
        return;
      }

      const signMessagePayload: SignMessageInput = {
        message: "Hello from Dynamic World App",
      };

      const { finalPayload } = await MiniKit.commandsAsync.signMessage(
        signMessagePayload
      );

      if (finalPayload.status === "error") {
        setResult(`Signing error: Signing failed`);
        return;
      }

      setResult(
        `Message signed successfully!\n` +
          `Signature: ${finalPayload.signature}\n` +
          `Address: ${finalPayload.address}`
      );
    } catch (error) {
      setResult(`Signing error: ${safeStringify(error)}`);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="dynamic-methods" data-theme={isDarkMode ? "dark" : "light"}>
      <div className="methods-container">
        <button
          className="btn btn-primary"
          onClick={verifyWithWorld}
          disabled={isVerifying}
        >
          {isVerifying ? "Verifying..." : "Verify with World ID"}
        </button>

        <button
          className="btn btn-primary"
          onClick={sendTransaction}
          disabled={isSending}
        >
          {isSending ? "Sending..." : "Send Transaction"}
        </button>

        <button
          className="btn btn-primary"
          onClick={makePayment}
          disabled={isPaying}
        >
          {isPaying ? "Paying..." : "Make Payment"}
        </button>

        <button className="btn btn-primary" onClick={checkMiniKitStatus}>
          Check MiniKit Status
        </button>

        <button
          className="btn btn-primary"
          onClick={signMessage}
          disabled={isSigning}
        >
          {isSigning ? "Signing..." : "Sign Message"}
        </button>
      </div>

      {result && (
        <div className="results-container">
          <pre className="results-text">{result}</pre>
        </div>
      )}

      {result && (
        <div className="clear-container">
          <button className="btn btn-primary" onClick={clearResult}>
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
