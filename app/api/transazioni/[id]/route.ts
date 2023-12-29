import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getServerUser(cookies());
  assert(user);
  const result = await prisma.transazione.delete({
    where: { id: Number(params.id), modificabile: true, profiloId: user.id },
  });
  return NextResponse.json({ result: result, error: false }, { status: 200 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const datiSchema = z.object({
    data: z.coerce.date(),
    categoriaId: z.coerce.number(),
    prezzo: z.coerce.number().min(0),
    descrizione: z.string().nullable(),
    tipologia: z.string().transform((v) => v == "1"),
  });
  try {
    const dati = await request.json();
    const datiParser = datiSchema.parse(dati);
    const user = await getServerUser(cookies());
    assert(user);
    const result = await prisma.transazione.update({
      data: {
        data: datiParser.data,
        categoriaId: datiParser.categoriaId,
        prezzo: datiParser.prezzo * (datiParser.tipologia ? -1 : 1),
        descrizione: datiParser.descrizione,
        profiloId: user.id,
      },
      where: { id: Number(params.id), modificabile: true, profiloId: user.id },
    });
    return NextResponse.json({ result: result, error: false }, { status: 200 });
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
