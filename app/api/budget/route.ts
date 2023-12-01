import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
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
    const result = await prisma.profile.findFirst({
      select: { budget: true },
      where: { id: user.id },
    });
    return NextResponse.json({ result: result, error: false }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 500 }
    );
  }
}
