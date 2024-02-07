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
    orderId: z.string().min(1),
  });

  try {
    const profile = await getServerUserProfile(cookies());
    assert(profile, "Non autorizzato");

    const dati = await request.json();
    const orderData = datiSchema.parse(dati);

    //Capture order to complete payment
    const PaypalClient = client();
    const paypalRequest = new paypal.orders.OrdersCaptureRequest(
      orderData.orderId
    );

    const ordine = await prisma.ordineIscrizioni.findUnique({
      where: {
        id: orderData.orderId,
      },
    });

    if (!ordine || ordine.profiloId !== profile.id) {
      throw new Error("Ordine non trovato");
    }

    const soggettiSchema = z.array(z.string().min(1));
    const soggetti = soggettiSchema.safeParse(ordine.soggetti);
    if (!soggetti.success) {
      throw new Error("Soggetti da iscrivere validi");
    }

    const gara = await prisma.gara.findUnique({
      where: {
        id: ordine.garaId,
      },
      include: {
        _count: {
          select: {
            iscrizioni: true,
          },
        },
      },
    });

    if (!gara || gara.isDeleted) {
      throw new Error("Gara non trovata");
    }

    const postiDisponibili = gara.capienza - gara._count.iscrizioni;
    if (postiDisponibili === 0) {
      throw new Error("Non ci sono altri posti disponibili");
    }

    const iscrizioniRichieste = soggetti.data.length;
    if (iscrizioniRichieste > postiDisponibili) {
      throw new Error(
        "Non ci sono abbastanza posti disponibili. Posti rimasti: " +
          postiDisponibili
      );
    }

    prisma.$transaction(async (tx) => {
      const result = await tx.iscrizione.createMany({
        data: soggetti.data.map((soggetto) => ({
          garaId: ordine.garaId,
          profiloId: ordine.profiloId,
          soggettoId: soggetto,
          importo: ordine.prezzoUnitario,
        })),
      });

      const paypalResponse = await PaypalClient.execute(paypalRequest);
      if (paypalResponse.statusCode !== 201) {
        throw new Error("Errore di PayPal");
      }

      return NextResponse.json({ success: true, result: result });
    });
  } catch (err: any) {
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
        message: err.message || "Errore sconosciuto",
      },
      { status: 500 }
    );
  }
}
