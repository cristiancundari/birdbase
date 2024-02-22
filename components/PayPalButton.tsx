"use client";
import React, { useRef } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import { OnApproveData, OnApproveActions } from "@paypal/paypal-js";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";

interface PayPalButtonProps {
  createOrder: () => Promise<string>;
  disabled?: boolean;
  forceReRender?: unknown[];
  completed: () => void;
}
function PayPalButton({
  createOrder,
  disabled,
  forceReRender,
  completed,
}: PayPalButtonProps) {
  const initialOptions: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
    currency: "EUR",
    intent: "capture",
  };

  const payPalCaptureOrder = async (orderId: string) => {
    const result = await apiFetch.post("/api/paypal/captureorder", {
      orderId,
    });
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "Ordine creato correttamente",
        success: true,
      });
      completed();
    }
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        forceReRender={forceReRender}
        disabled={disabled}
        style={{
          layout: "horizontal",
          tagline: false,
          height: 40,
          shape: "pill",
        }}
        createOrder={createOrder}
        onApprove={(data: OnApproveData, actions: OnApproveActions) =>
          payPalCaptureOrder(data.orderID)
        }
      />
    </PayPalScriptProvider>
  );
}

export default PayPalButton;
