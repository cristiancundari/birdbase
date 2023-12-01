import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Result } from "postcss";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser(cookies());
    assert(user);
    const spese = await prisma.transazione.groupBy({
      by: ["categoriaId"],
      where: { prezzo: { lt: 0 }, user_id: user.id },
      _sum: { prezzo: true },
    });
    const categorie = await prisma.categorie_spese.findMany();
    const result = spese.map((spesa) => {
      const categoria = categorie.find((i) => i.id == spesa.categoriaId);
      assert(categoria);
      return {
        categoria,
        totale: (spesa._sum.prezzo || 0) * -1,
      };
    });
    return NextResponse.json({ result: result, error: false }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 500 }
    );
  }
}
