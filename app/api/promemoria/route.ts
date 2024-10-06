import { createGoogleEvent } from "@/lib/googleapis";
import { prisma } from "@/lib/prisma";
import { getServerUser, getServerUserProfile } from "@/lib/supabase/helper";
import { $Enums } from "@prisma/client";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";

export async function POST(request: NextRequest) {
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
    assert(user, "Non autorizzato");

    let googlePromemoriaId = null;
    if (user.googleRefreshToken) {
      const testData = {
        googleToken: user.googleRefreshToken,
        title: datiParser.titolo,
        date: datiParser.dataOra,
        location: datiParser.descrizione,
        minutes: 30,
      };

      const testResponse = await createGoogleEvent(testData);
      googlePromemoriaId = testResponse.data?.data.id;
    }

    const result = await prisma.promemoria.create({
      data: {
        completato: datiParser.completato,
        data: datiParser.dataOra.toISOString(),
        ora: datiParser.dataOra.toISOString(),
        titolo: datiParser.titolo,
        priorita: datiParser.priorita,
        descrizione: datiParser.descrizione,
        profiloId: user.id,
        googlePromemoriaId: googlePromemoriaId,
      },
    });

    return NextResponse.json({ result: result, error: false }, { status: 200 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: error.message,
          error: true,
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          message: error.message,
          error: true,
        },
        { status: 500 }
      );
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser(cookies());
    assert(user);
    const searchParams = request.nextUrl.searchParams;
    const paramsObj = Object.fromEntries(searchParams.entries());

    const paramsSchema = z.object({
      mese_anno: z
        .string()
        .refine((val) => {
          return val.match(/^\d{1,2}\/\d{4}$/);
        }, "Formato non valido")
        .optional(),
    });
    const parsedParams = paramsSchema.parse(paramsObj);

    var filters = {}; // Declare the filters variable
    if (parsedParams.mese_anno) {
      const [mese, anno] = parsedParams.mese_anno.split("/");
      filters = {
        data: {
          gte: new Date(parseInt(anno), parseInt(mese) - 1, 1 - 6),
          lt: new Date(parseInt(anno), parseInt(mese), 1 + 6),
        },
      };
    }

    const res = await prisma.promemoria.findMany({
      where: { ...filters, profiloId: user.id },
    });
    return NextResponse.json({ result: res, error: false }, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.message, error: true },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 500 }
    );
  }
}
