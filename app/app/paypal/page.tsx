"use client";
import React from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";

const paypalCreateOrder = async () => {
  const result = await apiFetch.post("/api/paypal/createorder", {
    descrizione: 'Iscrizione N.X soggetti a "Campionato ornitologico 2021"',
    soggetti: ["IdSogg.1", "IdSogg.2"],
    garaId: "IdGara",
    prezzo: 10.5,
  });
  if (result.error) {
    showNotification({ message: result.message });
  } else {
    console.log("CREATED", result.data);
    return result.data.id;
  }
  return null;
};

const paypalCaptureOrder = async (orderId: string) => {
  const result = await apiFetch.post("/api/paypal/captureorder", {
    orderId,
  });
  if (result.error) {
    showNotification({ message: result.message });
  } else {
    console.log("CAPTURED", result.data);
  }
};

function PaypalPage() {
  const initialOptions: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
    currency: "EUR",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{
          layout: "horizontal",
          tagline: false,
          height: 40,
          shape: "pill",
        }}
        createOrder={async (data, actions) => {
          const order_id = await paypalCreateOrder();
          return order_id + "";
        }}
        onApprove={async (data, actions) => {
          let response = await paypalCaptureOrder(data.orderID);
        }}
      />
    </PayPalScriptProvider>
  );
}

export default PaypalPage;
