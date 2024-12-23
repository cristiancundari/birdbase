import { prisma } from "@/lib/prisma";
import { getServerUser, getServerUserProfile } from "@/lib/supabase/helper";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getInserzioni } from "./actions";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser(cookies());
    assert(user, "Utente non autorizzato");

    const inserzioni = await getInserzioni();
    return NextResponse.json(
      { result: inserzioni, error: false },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const query = await prisma.inserzione.create({
      data: {
        descrizione: datiValidate.descrizione,
        prezzo: datiValidate.prezzo,
        soggettoId: datiValidate.soggetto,
        profiloId: user.id,
      },
    });
    return NextResponse.json({ error: false, data: query }, { status: 200 });
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
