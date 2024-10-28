import client from "@/lib/paypal/client";
import { prisma } from "@/lib/prisma";
import { getServerUserProfile } from "@/lib/supabase/helper";
import paypal from "@paypal/checkout-server-sdk";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const datiSchema = z.object({
    descrizione: z.string().min(1),
    soggetti: z.array(z.string().min(1)),
    garaId: z.string().min(1),
  });

  try {
    const profile = await getServerUserProfile(cookies());
    assert(profile, "Non autorizzato");

    const dati = await request.json();
    const datiParsed = datiSchema.parse(dati);

    const gara = await prisma.gara.findUnique({
      where: { id: datiParsed.garaId },
      include: { _count: { select: { iscrizioni: true } } },
    });
    if (!gara || gara.isDeleted) {
      throw new Error("Impossibile iscrivere i soggetti alla gara selezionata");
    }

    const postiDisponibili = gara.capienza - gara._count.iscrizioni;
    if (postiDisponibili < datiParsed.soggetti.length) {
      throw new Error(`Ci sono solo ${postiDisponibili} posti disponibili`);
    }

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
            value: (datiParsed.soggetti.length * gara.prezzo).toString(),
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

    const result = await prisma.ordineIscrizioni.create({
      data: {
        id: paypalResponse.result.id,
        descrizione: datiParsed.descrizione,
        garaId: datiParsed.garaId,
        profiloId: profile.id,
        prezzoUnitario: gara.prezzo,
        soggetti: datiParsed.soggetti,
      },
    });
    return NextResponse.json({ error: false, result: result });
  } catch (err: any) {
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
        message:
          err.message ||
          "Qualcosa è andato storto durante creazione dell'ordine.",
      },
      { status: 500 }
    );
  }
}
