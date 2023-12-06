import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import { Prisma } from "@prisma/client";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Result } from "postcss";

export type IncassiQueryResult = {
  mese: number;
  totale: number;
};
export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser(cookies());
    assert(user);
    //TODO INPUT YEAR
    const year = 2023;
    const result = await prisma.$queryRaw<IncassiQueryResult[]>(
      Prisma.sql`select extract(month from data)::integer AS mese, SUM(prezzo) AS totale FROM "Transazione" WHERE prezzo>0 AND extract(year from data) = ${year} AND user_id = ${user.id}::uuid GROUP BY mese`
    );
    return NextResponse.json({ result: result, error: false }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 500 }
    );
  }
}
