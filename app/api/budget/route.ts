import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import { Prisma } from "@prisma/client";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(request: NextRequest) {
  const datiSchema = z.coerce.number().min(1);
  try {
    const dati = await request.json();
    const budget = datiSchema.parse(dati);
    const user = await getServerUser(cookies());
    const result = await prisma.profile.update({
      data: { budget: budget },
      where: { id: user?.id },
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

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser(cookies());
    assert(user, "Utente non autorizzato");
    const budget = await prisma.profile.findFirst({
      select: { budget: true },
      where: { id: user.id },
    });
    const oggi = new Date();
    const mese_corrente = oggi.getMonth();
    const anno = 2023; //TODO farsi passare l'anno dal client
    const next_year = anno + Math.floor((mese_corrente + 1) / 12);
    const next_month = (mese_corrente + 1) % 12;
    const spese = await prisma.transazione.aggregate({
      _sum: { prezzo: true },
      where: {
        prezzo: { lt: 0 },
        data: {
          gte: new Date(anno, mese_corrente, 1),
          lt: new Date(next_year, next_month, 1),
        },
        user_id: user.id,
      },
    });
    return NextResponse.json(
      { result: { budget: budget, spese: spese }, error: false },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 500 }
    );
  }
}
