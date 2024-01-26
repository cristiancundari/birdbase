import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import { SoggettoWithGenitori, SoggettoWithParentela } from "@/types/types";
import { Soggetto } from "@prisma/client";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  calcolaLivelliParentela,
  checkParentele,
  coloreParentela,
  nomeParentela,
  percentualeParentela,
} from "./checkParentele";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const soggettoId = searchParams.get("soggetto");
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
  if (soggetto.sesso == null) {
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
  const result = elaboraSoggetto(listaSoggetti, soggetto);
  return NextResponse.json({ result: result, error: false }, { status: 200 });
}

function elaboraSoggetto(
  listaSoggetti: SoggettoWithGenitori[],
  soggetto: SoggettoWithGenitori
): SoggettoWithParentela[] {
  const obj: Record<string, SoggettoWithGenitori> = {};
  for (let s of listaSoggetti) {
    obj[s.id] = s;
  }
  const parentiSoggetto = calcolaLivelliParentela(soggetto, obj);
  const partners = listaSoggetti.filter((s) => s.sesso == !soggetto.sesso);
  const result = partners.map((partner) => {
    const parentiPartner = calcolaLivelliParentela(partner, obj);
    const gradoParentela = checkParentele(parentiSoggetto, parentiPartner);
    if (gradoParentela) {
      const gradoParentelaStr = `${gradoParentela[0]},${gradoParentela[1]}`;
      return {
        soggetto: { ...partner, covata: undefined } as Soggetto,
        parentela: {
          nome: nomeParentela[gradoParentelaStr],
          percentuale: percentualeParentela[gradoParentelaStr],
          colore: coloreParentela(percentualeParentela[gradoParentelaStr]),
        },
      };
    } else {
      return {
        soggetto: { ...partner, covata: undefined } as Soggetto,
        parentela: null,
      };
    }
  });
  return result;
}
