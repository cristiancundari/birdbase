import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import { BudgetRequest } from "@/types/types";
import { Prisma } from "@prisma/client";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(request: NextRequest) {
  const datiSchema = z.object({
    budget: z.coerce.number().min(1),
  });

  try {
    const dati = await request.json();
    const datiParsed = datiSchema.parse(dati);
    const user = await getServerUser(cookies());
    const result = await prisma.profilo.update({
      data: { budget: datiParsed.budget },
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
    const budget = await prisma.profilo.findFirst({
      select: { budget: true },
      where: { id: user.id },
    });
    assert(budget);
    const oggi = new Date();
    const mese_corrente = oggi.getMonth();
    const anno_corrente = oggi.getFullYear();
    const spese = await prisma.transazione.aggregate({
      _sum: { prezzo: true },
      where: {
        prezzo: { lt: 0 },
        data: {
          gte: new Date(anno_corrente, mese_corrente, 1),
          lt: new Date(anno_corrente, mese_corrente + 1, 1),
        },
        profiloId: user.id,
      },
    });
    const result: BudgetRequest = { budget: budget, spese: spese };
    return NextResponse.json({ result: result, error: false }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 500 }
    );
  }
}
