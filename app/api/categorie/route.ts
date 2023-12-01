import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const categorie = await prisma.categorie_spese.findMany();
  return NextResponse.json(
    { error: false, result: categorie },
    { status: 200 }
  );
}
