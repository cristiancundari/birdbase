import { formatAnelletto } from "@/lib/helper";
import client from "@/lib/paypal/client";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import paypal from "@paypal/checkout-server-sdk";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const datiSchema = z.object({
    id: z.string(),
  });

  try {
    const user = await getServerUser(cookies());
    assert(user, "Utente non trovato");
    const result = await request.json();
    const datiValidate = datiSchema.parse(result);

    const searchOrdine = await prisma.ordineInserzione.findUnique({
      where: { id: datiValidate.id },
      include: { inserzione: { include: { soggetto: true } } },
    });

    if (!searchOrdine) {
      throw new Error("Impossibile trovare un ordine.");
    }

    const transazione = await prisma.$transaction(async (tx) => {
      const copiaSoggetto = await tx.soggetto.create({
        data: {
          ...searchOrdine.inserzione.soggetto,
          id: undefined,
          profiloId: user.id,
          note: "",
          gabbia: null,
          avatar: null,
          preferito: false,
        },
      });

      const confermaInserzione = await tx.inserzione.update({
        where: { id: searchOrdine.inserzioneId },
        data: { soggettoCopiaId: copiaSoggetto.id },
      });

      await tx.transazione.createMany({
        data: [
          {
            data: new Date(),
            prezzo: confermaInserzione.prezzo,
            categoriaId: 3,
            profiloId: confermaInserzione.profiloId,
            descrizione:
              "Vendita soggetto " +
              formatAnelletto(
                copiaSoggetto.rna,
                copiaSoggetto.numero,
                copiaSoggetto.anno
              ),
          },
          {
            data: new Date(),
            prezzo: -confermaInserzione.prezzo,
            categoriaId: 3,
            profiloId: user.id,
            descrizione:
              "Acquisto soggetto " +
              formatAnelletto(
                copiaSoggetto.rna,
                copiaSoggetto.numero,
                copiaSoggetto.anno
              ),
          },
        ],
      });
    });

    const PaypalClient = client();
    const paypalRequest = new paypal.orders.OrdersCaptureRequest(
      String(datiValidate.id)
    );

    const paypalResponse = await PaypalClient.execute(paypalRequest);
    if (paypalResponse.statusCode !== 201) {
      throw new Error("Errore di PayPal");
    }

    return NextResponse.json(
      { error: false, data: transazione },
      { status: 200 }
    );
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
