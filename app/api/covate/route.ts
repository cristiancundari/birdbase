import { apiFetch } from "@/lib/apiFetch";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser(cookies());
    assert(user);
    const data = await prisma.covata.findMany({
      where: { profiloId: user.id },
      include: {
        madre: true,
        padre: true,
        _count: { select: { figli: true } },
      },
      orderBy: [{ data: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ result: data, error: false }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  const datiSchema = z.object({
    //TODO verificare che padre e madre siano soggetti dello user.
    padre: z.string().min(1),
    madre: z.string().min(1),
    dataCovata: z.coerce.date(),
    completata: z.coerce.boolean(),
    uovaDeposte: z.coerce.number().min(0),
    gabbia: z
      .string()
      .max(0)
      .transform((v) => null)
      .or(z.coerce.number().nullable()),
  });
  try {
    const dati = await request.json();
    const datiParsed = datiSchema.parse(dati);
    const user = await getServerUser(cookies());
    assert(user);
    const result = await prisma.covata.create({
      data: {
        data: datiParsed.dataCovata,
        gabbia: datiParsed.gabbia,
        idMadre: datiParsed.madre,
        idPadre: datiParsed.padre,
        profiloId: user.id,
        uovaDeposte: datiParsed.uovaDeposte,
        completata: datiParsed.completata,
      },
      include: {
        madre: true,
        padre: true,
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
