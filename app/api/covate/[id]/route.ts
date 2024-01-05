import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const datiSchema = z
    .object({
      //TODO verificare che padre e madre siano soggetti dello user.
      padre: z.string().min(1),
      madre: z.string().min(1),
      dataCovata: z.coerce.date(),
      completata: z.coerce.boolean(),
      uovaDeposte: z.coerce.number().min(0),
      uovaSchiuse: z.coerce.number().min(0),
      gabbia: z
        .string()
        .max(0)
        .transform((v) => null)
        .or(z.coerce.number().nullable()),
    })
    .refine((values) => values.uovaSchiuse <= values.uovaDeposte, {
      path: ["uovaSchiuse"],
      message: "Il numero non può essere maggiore delle uova deposte",
    });
  try {
    const dati = await request.json();
    const datiParsed = datiSchema.parse(dati);
    const user = await getServerUser(cookies());
    assert(user);
    const result = await prisma.covata.update({
      data: {
        data: datiParsed.dataCovata,
        gabbia: datiParsed.gabbia,
        idMadre: datiParsed.madre,
        idPadre: datiParsed.padre,
        uovaDeposte: datiParsed.uovaDeposte,
        uovaSchiuse: datiParsed.uovaSchiuse,
        completata: datiParsed.completata,
      },
      include: {
        madre: true,
        padre: true,
      },
      where: {
        id: Number(params.id),
        profiloId: user.id,
      },
    });
    return NextResponse.json({ error: false, result: result }, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: true, message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getServerUser(cookies());
    assert(user);
    const result = await prisma.covata.delete({
      where: { profiloId: user.id, id: Number(params.id) },
    });
    return NextResponse.json({ result: result, error: false }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { messsage: error.message, error: true },
      { status: 500 }
    );
  }
}
