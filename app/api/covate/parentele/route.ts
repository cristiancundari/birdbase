import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { elaboraSoggetto } from "./checkParentele";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const soggettoId = searchParams.get("soggetto");
  const onlyPartners = searchParams.get("only_partners") === "true";

  const user = await getServerUser(cookies());
  assert(user);
  if (soggettoId == null) {
    return NextResponse.json(
      { message: "Id non trovato", error: true },
      { status: 400 }
    );
  }
  const soggetto = await prisma.soggetto.findFirst({
    where: { id: soggettoId, profiloId: user.id },
    include: {
      covata: {
        select: { idPadre: true, idMadre: true },
      },
    },
  });
  if (!soggetto) {
    return NextResponse.json(
      { message: "Soggetto non trovato", error: true },
      { status: 400 }
    );
  }
  if (onlyPartners && soggetto.sesso == null) {
    return NextResponse.json(
      { message: "Soggetto non valido", error: true },
      { status: 400 }
    );
  }
  const listaSoggetti = await prisma.soggetto.findMany({
    where: {
      profiloId: user.id,
    },
    include: {
      covata: {
        select: { idPadre: true, idMadre: true },
      },
    },
    orderBy: { dataNascita: "desc" },
  });
  const result = elaboraSoggetto(listaSoggetti, soggetto, onlyPartners);
  return NextResponse.json({ result: result, error: false }, { status: 200 });
}
