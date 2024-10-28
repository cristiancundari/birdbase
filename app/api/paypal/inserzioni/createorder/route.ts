import client from "@/lib/paypal/client";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import paypal from "@paypal/checkout-server-sdk";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const datiSchema = z.object({
    descrizione: z.string(),
    prezzo: z.number(),
    profiloId: z.string(),
    inserzioneId: z.number(),
  });

  try {
    const result = await request.json();
    const datiValidate = datiSchema.parse(result);

    const PaypalClient = client();
    //This code is lifted from https://github.com/paypal/Checkout-NodeJS-SDK
    const paypalRequest = new paypal.orders.OrdersCreateRequest();
    paypalRequest.headers.Prefer = "return=representation";
    paypalRequest.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: datiValidate.descrizione,
          amount: {
            currency_code: "EUR",
            value: datiValidate.prezzo.toString(),
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
    });

    const paypalResponse = await PaypalClient.execute(paypalRequest);

    if (paypalResponse.statusCode !== 201) {
      throw new Error("Errore di PayPal");
    }

    const query = await prisma.ordineInserzione.create({
      data: {
        id: paypalResponse.result.id,
        profiloId: datiValidate.profiloId,
        inserzioneId: datiValidate.inserzioneId,
      },
    });

    return NextResponse.json({ error: false, result: query }, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.message, error: true },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { message: error.message, error: true },
        { status: 500 }
      );
    }
  }
}
