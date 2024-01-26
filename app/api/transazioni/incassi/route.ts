import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import { IncassoQueryResult } from "@/types/types";
import { Prisma } from "@prisma/client";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser(cookies());
    assert(user);
    const result = await prisma.$queryRaw<IncassoQueryResult[]>(
      Prisma.sql`select extract(month from data)::integer AS mese, SUM(prezzo) AS totale,extract(year from data)::integer as anno FROM "transazioni" WHERE prezzo>0 AND profilo_id = ${user.id}::uuid GROUP BY mese,anno`
    );
    return NextResponse.json({ result: result, error: false }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 500 }
    );
  }
}
