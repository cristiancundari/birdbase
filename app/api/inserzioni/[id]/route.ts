import { prisma } from "@/lib/prisma";
import { getServerUserProfile } from "@/lib/supabase/helper";
import { assert } from "console";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const datiSchema = z.object({
    id: z.coerce.number(),
  });

  try {
    const user = await getServerUserProfile(cookies());
    assert(user, "Non autorizzato");

    const values = datiSchema.parse(params);
    const result = await prisma.inserzione.delete({
      where: { id: values.id, profiloId: user?.id },
    });

    return NextResponse.json({ result: result, error: false }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const datiSchema = z.object({
    descrizione: z.string(),
    soggetto: z.string(),
    prezzo: z.coerce.number(),
  });

  try {
    const user = await getServerUserProfile(cookies());
    assert(user, "Utente non autorizzato");

    const body = await request.json();
    const datiValidate = datiSchema.parse(body);

    const result = await prisma.inserzione.update({
      where: {
        id: Number(params.id),
        profiloId: user?.id,
        soggettoCopiaId: null,
      },
      data: {
        descrizione: datiValidate.descrizione,
        prezzo: datiValidate.prezzo,
        soggettoId: datiValidate.soggetto,
      },
    });

    return NextResponse.json({ error: false, data: result }, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: true, message: error.message },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: true, message: error.message },
        { status: 500 }
      );
    }
  }
}
