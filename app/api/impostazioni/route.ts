import { MAX_LVL_PARENTELA, MIN_LVL_PARENTELA } from "@/lib/helper";
import { evaluate } from "@/lib/parser/evaluator";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(req: NextRequest) {
  const bodySchema = z.object({
    formulaData: z.string(),
    formulaParentela: z.string(),
    percentualeFormulaData: z.number().int().gte(0).lte(100),
  });

  try {
    const user = await getServerUser(cookies());
    assert(user, "Non autenticato");
    const body = await req.json();
    const bodyParsed = bodySchema.parse(body);
    //eseguiamo le formule per verificare se non si verificano eccezioni
    evaluate(bodyParsed.formulaData, 0);
    evaluate(bodyParsed.formulaParentela, 0);

    const result = await prisma.profilo.update({
      data: {
        formulaData: bodyParsed.formulaData,
        formulaParentela: bodyParsed.formulaParentela,
        percentualeFormulaData: bodyParsed.percentualeFormulaData,
      },
      where: {
        id: user.id,
      },
    });
    return NextResponse.json({ error: false, data: result }, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: true, message: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: true, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const bodySchema = z.object({
    limiteLivelliParentela: z.number().int().gte(MIN_LVL_PARENTELA).lte(MAX_LVL_PARENTELA),
  });

  try {
    const user = await getServerUser(cookies());
    assert(user, "Non autenticato");
    const body = await req.json();

    const bodyParsed = bodySchema.parse(body);

    const result = await prisma.profilo.update({
      data: {
        limiteLivelliParentela: bodyParsed.limiteLivelliParentela,
      },
      where: {
        id: user.id,
      },
    });
    return NextResponse.json({ error: false, data: result }, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: true, message: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: true, message: error.message }, { status: 500 });
  }
}
