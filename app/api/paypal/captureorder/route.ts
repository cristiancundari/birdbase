import client from "@/lib/paypal/client";
import paypal from "@paypal/checkout-server-sdk";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const datiSchema = z.object({
    orderId: z.string().min(1),
  });

  try {
    const dati = await request.json();
    const orderData = datiSchema.parse(dati);

    //Capture order to complete payment
    const PaypalClient = client();
    const paypalRequest = new paypal.orders.OrdersCaptureRequest(
      orderData.orderId
    );

    const paypalResponse = await PaypalClient.execute(paypalRequest);
    if (!paypalResponse) {
      return NextResponse.json(
        {
          error: true,
          message: "Some Error Occured at backend",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, result: paypalResponse.result });
  } catch (err) {
    console.log("Err at Capture Order: ", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: true,
          message: "Parametri specificati non validi",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: true,
        message: "Order capture error",
      },
      { status: 500 }
    );
  }
}
