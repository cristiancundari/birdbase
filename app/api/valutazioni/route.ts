import { evaluate } from "@/lib/parser/evaluator";
import { prisma } from "@/lib/prisma";
import { getServerUserProfile } from "@/lib/supabase/helper";
import { IscrizioniWithGara, SoggettoWithParentela } from "@/types/types";
import assert from "assert";
import { differenceInDays, differenceInYears } from "date-fns";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { elaboraParenteleSoggetto } from "../covate/parentele/checkParentele";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUserProfile(cookies());
    assert(user, "Non autorizzato");
    const formulaData = user.formulaData || "1";
    const formulaParentela = user.formulaParentela || "1";

    const tuttiSoggetti = await prisma.soggetto.findMany({
      include: {
        covata: {
          select: { idPadre: true, idMadre: true },
        },
        inserzioniVendita: {
          where: {
            NOT: {
              soggettoCopiaId: null,
            },
          },
        },
      },
      orderBy: { dataNascita: "desc" },
    });

    //Otteniamo una lista di tutti i soggetti dell'allevatore
    const mieiSoggetti = tuttiSoggetti.filter((s) => s.profiloId === user.id);

    //creiamo un dizionario con chiave idSoggetto e valore lista dei parenti
    const dictSoggettiParenti: { [key: string]: SoggettoWithParentela[] } = {};
    for (let mioSoggetto of mieiSoggetti) {
      const parenti = elaboraParenteleSoggetto(
        tuttiSoggetti,
        mioSoggetto,
        user
      );
      dictSoggettiParenti[mioSoggetto.id] = parenti;
    }

    //creaimo un set con tutti gli id dei soggetti necessari al calcolo della valutazione
    const idSoggetti: Set<string> = new Set();
    for (const [id, parenti] of Object.entries(dictSoggettiParenti)) {
      idSoggetti.add(id);
      for (let parente of parenti) {
        idSoggetti.add(parente.soggetto.id);
      }
    }

    //Otteniamo i risultati delle gare dei soggetti interessati al calcolo della valutazione
    const risultatiGare = await prisma.iscrizione.findMany({
      where: {
        soggettoId: { in: Array.from(idSoggetti.values()) },
        voto: { not: null },
      },
      include: { gara: true },
    });

    const dictGare: { [key: string]: IscrizioniWithGara[] } = {};
    for (let risultato of risultatiGare) {
      if (!dictGare[risultato.soggettoId]) {
        dictGare[risultato.soggettoId] = [];
      }
      dictGare[risultato.soggettoId].push(risultato);
    }

    //Effettuaiamo il calcolo ponderato
    const dictValutazioni: { [key: string]: number } = {};
    for (let soggetto of mieiSoggetti) {
      const gareSoggettoEParenti: (IscrizioniWithGara & {
        gradoParentela: number;
      })[] = [];
      if (dictGare[soggetto.id] && dictGare[soggetto.id].length > 0) {
        gareSoggettoEParenti.push(
          ...dictGare[soggetto.id].map((g) => ({ ...g, gradoParentela: 0 }))
        );
      }
      for (let parente of dictSoggettiParenti[soggetto.id]) {
        if (
          dictGare[parente.soggetto.id] &&
          dictGare[parente.soggetto.id].length > 0
        ) {
          gareSoggettoEParenti.push(
            ...dictGare[parente.soggetto.id].map((g) => ({
              ...g,
              gradoParentela: parente.parentela!.grado,
            }))
          );
        }
      }
      const mediaPesataData = gareSoggettoEParenti.reduce(
        (accumulatore, elemento) => {
          const differenzaInAnni =
            differenceInDays(new Date(), elemento.gara.data) / 365.25;
          const peso = evaluate(formulaData, differenzaInAnni);
          accumulatore.sommaValori += elemento.voto! * peso!;
          accumulatore.sommaPesi += peso!;
          return accumulatore;
        },
        { sommaValori: 0, sommaPesi: 0 }
      );

      // La media pesata è la somma dei valori pesati divisa per la somma dei pesi
      const valutazioneData =
        mediaPesataData.sommaPesi == 0
          ? 0
          : mediaPesataData.sommaValori / mediaPesataData.sommaPesi;

      const mediaPesataParentela = gareSoggettoEParenti.reduce(
        (accumulatore, elemento) => {
          const differenzaGradoParentela = elemento.gradoParentela;
          const peso = evaluate(formulaParentela, differenzaGradoParentela);
          accumulatore.sommaValori += elemento.voto! * peso!;
          accumulatore.sommaPesi += peso!;
          return accumulatore;
        },
        { sommaValori: 0, sommaPesi: 0 }
      );

      const valutazioneParentela =
        mediaPesataParentela.sommaPesi == 0
          ? 0
          : mediaPesataParentela.sommaValori / mediaPesataParentela.sommaPesi;

      const valutazione =
        (valutazioneData * user.percentualeFormulaData +
          valutazioneParentela * (100 - user.percentualeFormulaData)) /
        100;
      dictValutazioni[soggetto.id] = valutazione;
    }

    return NextResponse.json(
      { result: dictValutazioni, error: false },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: true, message: error.message });
  }
}
