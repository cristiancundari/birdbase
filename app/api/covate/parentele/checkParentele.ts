import { SoggettoWithGenitori, SoggettoWithParentela } from "@/types/types";
import { Soggetto } from "@prisma/client";

export function elaboraSoggetto(
  listaSoggetti: SoggettoWithGenitori[],
  soggetto: SoggettoWithGenitori,
  onlyPartners?: boolean
): SoggettoWithParentela[] {
  const obj: Record<string, SoggettoWithGenitori> = {};
  for (let s of listaSoggetti) {
    obj[s.id] = s;
  }
  const parentiSoggetto = calcolaLivelliParentela(soggetto, obj);
  const partners = onlyPartners
    ? listaSoggetti.filter((s) => s.sesso == !soggetto.sesso)
    : listaSoggetti;
  const result = partners.map((partner) => {
    const parentiPartner = calcolaLivelliParentela(partner, obj);
    const gradoParentela = checkParentele(parentiSoggetto, parentiPartner);
    if (gradoParentela) {
      const gradoParentelaStr = `${gradoParentela[0]},${gradoParentela[1]}`;
      return {
        soggetto: { ...partner, covata: undefined } as Soggetto,
        parentela: {
          nome: datiParentela[gradoParentelaStr].nome,
          plurale: datiParentela[gradoParentelaStr].plurale,
          percentuale: datiParentela[gradoParentelaStr].percentuale,
          colore: coloreParentela(datiParentela[gradoParentelaStr].percentuale),
        },
      };
    } else {
      return {
        soggetto: { ...partner, covata: undefined } as Soggetto,
        parentela: null,
      };
    }
  });

  return onlyPartners
    ? result
    : result
        .filter((p) => p.parentela !== null && p.soggetto.id !== soggetto.id)
        .sort((a, b) => b.parentela!.percentuale - a.parentela!.percentuale);
}

export function calcolaLivelliParentela(
  partner: SoggettoWithGenitori,
  soggetti: Record<string, SoggettoWithGenitori>
): [string, string][][] {
  const res: [string, string][][] = [];
  res.push([[partner.id, ""]]);

  for (let lvl = 0; lvl < 4; lvl++) {
    const last = res[lvl];
    const step: [string, string][] = [];
    for (let tuple of last) {
      for (let sglTup of tuple) {
        if (sglTup) {
          const covata = soggetti[sglTup].covata;
          if (covata) {
            step.push([covata.idMadre, covata.idPadre]);
          }
        }
      }
    }
    res.push(step);
  }
  return res;
}

export function checkParentele(
  a: [string, string][][],
  b: [string, string][][]
) {
  const liv = Math.min(4, Math.max(a.length, b.length));
  for (let j = 0; j <= liv; j++) {
    for (let i = 0; i < j; i++) {
      const res = confrontaLivelli(a[i], b[j]);
      if (res) {
        return [i, j];
      }
    }
    for (let i = 0; i <= j; i++) {
      const res = confrontaLivelli(a[j], b[i]);
      if (res) {
        return [j, i];
      }
    }
  }
  return false;
}

function confrontaLivelli(a: [string, string][], b: [string, string][]) {
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (confrontaTuple(a[i], b[j])) {
        return true;
      }
    }
  }
  return false;
}

function confrontaTuple(a: [string, string], b: [string, string]) {
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (a[i] == b[j] && a[i] != "") {
        return true;
      }
    }
  }
  return false;
}

export const datiParentela: {
  [key: string]: { nome: string; percentuale: number; plurale: string };
} = {
  "0,0": { nome: "", percentuale: 100, plurale: "" },
  "0,1": { nome: "Figlio", percentuale: 90, plurale: "Figli" },
  "0,2": { nome: "Nipote (nonno)", percentuale: 70, plurale: "Nipoti (nonno)" },
  "0,3": { nome: "Bisnipote", percentuale: 40, plurale: "Bisnipoti" },
  "0,4": { nome: "Trisnipote", percentuale: 20, plurale: "Trisnipoti" },
  "1,0": { nome: "Genitore", percentuale: 90, plurale: "Genitori" },
  "1,1": { nome: "Fratello", percentuale: 80, plurale: "Fratelli" },
  "1,2": { nome: "Nipote", percentuale: 60, plurale: "Nipoti" },
  "1,3": { nome: "Pronipote", percentuale: 35, plurale: "Pronipoti" },
  "1,4": { nome: "Pro-pronipote", percentuale: 18, plurale: "Pro-pronipoti" },
  "2,0": { nome: "Nonno", percentuale: 70, plurale: "Nonni" },
  "2,1": { nome: "Zio", percentuale: 60, plurale: "Zii" },
  "2,2": { nome: "Cugino", percentuale: 50, plurale: "Cugini" },
  "2,3": { nome: "Procugino", percentuale: 30, plurale: "Procugini" },
  "2,4": { nome: "Pro-procugino", percentuale: 13, plurale: "Pro-procugini" },
  "3,0": { nome: "Bisnonno", percentuale: 40, plurale: "Bisnonni" },
  "3,1": { nome: "Prozio (nonno)", percentuale: 35, plurale: "Prozii (nonno)" },
  "3,2": {
    nome: "Procugino (nonno)",
    percentuale: 30,
    plurale: "Procugini (nonno)",
  },
  "3,3": { nome: "Cugino 2°", percentuale: 25, plurale: "Cugini 2°" },
  "3,4": { nome: "Procugino 2°", percentuale: 8, plurale: "Procugini 2°" },
  "4,0": { nome: "Trisnonno", percentuale: 20, plurale: "Trisnonni" },
  "4,1": {
    nome: "Prozio (bisnonno)",
    percentuale: 18,
    plurale: "Prozii (bisnonno)",
  },
  "4,2": {
    nome: "Pro-procugino (bisnonno)",
    percentuale: 13,
    plurale: "Pro-procugini (bisnonno)",
  },
  "4,3": {
    nome: "Procugino 2° (bisnonno)",
    percentuale: 8,
    plurale: "Procugini 2° (bisnonno)",
  },
  "4,4": { nome: "Cugino 3°", percentuale: 5, plurale: "Cugini 3°" },
};

export function coloreParentela(percentuale: number) {
  if (percentuale >= 80) {
    return "red";
  } else if (percentuale >= 50) {
    return "orange";
  } else {
    return "teal";
  }
}
