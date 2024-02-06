import client from "@/lib/paypal/client";
import paypal from "@paypal/checkout-server-sdk";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const datiSchema = z.object({
    descrizione: z.string().min(1),
    soggetti: z.array(z.string().min(1)),
    gara: z.string().min(1),
    prezzo: z.coerce.number(),
  });

  try {
    const dati = await request.json();
    const datiParsed = datiSchema.parse(dati);

    const PaypalClient = client();
    //This code is lifted from https://github.com/paypal/Checkout-NodeJS-SDK
    const paypalRequest = new paypal.orders.OrdersCreateRequest();
    paypalRequest.headers.Prefer = "return=representation";
    paypalRequest.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: datiParsed.descrizione,
          amount: {
            currency_code: "EUR",
            value: (datiParsed.soggetti.length * datiParsed.prezzo).toString(),
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
    });
    const paypalResponse = await PaypalClient.execute(paypalRequest);
    if (paypalResponse.statusCode !== 201) {
      console.log("RES: ", paypalResponse);
      return NextResponse.json(
        {
          error: true,
          message: "Some Error Occured at backend",
        },
        { status: 500 }
      );
    }

    // Your Custom Code for doing something with order
    // Usually Store an order in the database like MongoDB

    return NextResponse.json({ error: false, result: paypalResponse.result });
  } catch (err) {
    console.log("Err at Create Order: ", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: true,
          message: "Parametri specificati non validi.\n" + err.message,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: true,
        message: "Could Not Found the user",
      },
      { status: 500 }
    );
  }
}
