import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import { Prisma } from "@prisma/client";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Result } from "postcss";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser(cookies());
    assert(user);
    const result =
      await prisma.$queryRaw(Prisma.sql`select extract(year from data)::integer AS anno, SUM(prezzo) AS totale, spesa.nome as categoria FROM "transazioni" LEFT JOIN categorie_spesa spesa
ON transazioni.categoria_id = spesa.id WHERE prezzo<0 AND profilo_id = ${user.id}::uuid GROUP BY anno, spesa.nome,categoria_id`);
    return NextResponse.json({ result: result, error: false }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 500 }
    );
  }
}
