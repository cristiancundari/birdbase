import { deleteGoogleEvent, editGoogleEvent } from "@/lib/googleapis";
import { prisma } from "@/lib/prisma";
import { getServerUser, getServerUserProfile } from "@/lib/supabase/helper";
import { $Enums } from "@prisma/client";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getServerUserProfile(cookies());
    assert(user);

    const result = await prisma.promemoria.delete({
      where: { profiloId: user.id, id: Number(params.id) },
    });

    if (user.googleRefreshToken && result.googlePromemoriaId) {
      await deleteGoogleEvent({
        eventId: result.googlePromemoriaId,
        googleToken: user.googleRefreshToken,
      });
    }

    return NextResponse.json({ result: result, error: false }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { messsage: error.message, error: true },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const datiSchema = z.object({
    completato: z.boolean(),
    dataOra: z.coerce.date(),
    titolo: z.string(),
    descrizione: z.string(),
    priorita: z.nativeEnum($Enums.Priorita),
  });

  try {
    const dati = await request.json();
    const datiParser = datiSchema.parse(dati);
    const user = await getServerUserProfile(cookies());
    assert(user);
    const result = await prisma.promemoria.update({
      data: {
        completato: datiParser.completato,
        data: datiParser.dataOra.toISOString(),
        ora: datiParser.dataOra.toISOString(),
        titolo: datiParser.titolo,
        priorita: datiParser.priorita,
        descrizione: datiParser.descrizione,
        profiloId: user.id,
      },
      where: {
        id: Number(params.id),
        profiloId: user.id,
      },
    });

    if (user.googleRefreshToken && result.googlePromemoriaId) {
      await editGoogleEvent({
        googleToken: user.googleRefreshToken,
        title: result.titolo,
        date: datiParser.dataOra,
        location: result.descrizione,
        eventId: result.googlePromemoriaId,
        minutes: 30,
      });
    }

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
