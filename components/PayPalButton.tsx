"use client";
import {
  OnApproveActions,
  OnApproveData,
  PayPalButtonsComponentOptions,
} from "@paypal/paypal-js";
import {
  PayPalButtons,
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";

interface PayPalButtonProps {
  createOrder: () => Promise<string>;
  captureOrder: (orderId: string) => Promise<void>;
  disabled?: boolean;
  forceReRender?: unknown[];
  style?: PayPalButtonsComponentOptions["style"];
}

function PayPalButton({
  createOrder,
  captureOrder,
  disabled,
  forceReRender,
  style,
}: PayPalButtonProps) {
  return (
    <PayPalButtons
      forceReRender={forceReRender}
      disabled={disabled}
      style={{
        layout: "horizontal",
        tagline: false,
        height: 40,
        shape: "pill",
        ...style,
      }}
      createOrder={createOrder}
      onApprove={(data: OnApproveData, actions: OnApproveActions) =>
        captureOrder(data.orderID)
      }
    />
  );
}

export default PayPalButton;
