import { SoggettoWithGenitori } from "@/types/types";

export function calcolaLivelliParentela(
  partner: SoggettoWithGenitori,
  soggetti: Record<string, SoggettoWithGenitori>
): [string, string][][] {
  const res: [string, string][][] = [];
  res.push([[partner.id, ""]]);
  for (let i = 1; i <= 4; i++) {
    res.push(calcolaParenti(soggetti, partner, i));
  }
  return res;
}

function calcolaParenti(
  soggetti: Record<string, SoggettoWithGenitori>,
  soggetto: SoggettoWithGenitori,
  livello: number
): [string, string][] {
  if (soggetto.covata == null) {
    return [];
  }
  const madre = soggetto.covata.idMadre;
  const padre = soggetto.covata.idPadre;
  if (livello == 1) {
    return [[madre, padre]];
  } else {
    return [
      ...calcolaParenti(soggetti, soggetti[madre], livello - 1),
      ...calcolaParenti(soggetti, soggetti[padre], livello - 1),
    ];
  }
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

export const nomeParentela: { [key: string]: string } = {
  "0,0": "",
  "0,1": "Figlio",
  "0,2": "Nipote (nonno)",
  "0,3": "Bisnipote",
  "0,4": "Trisnipote",
  "1,0": "Genitore",
  "1,1": "Fratello",
  "1,2": "Nipote",
  "1,3": "Pronipote",
  "1,4": "Pro-pronipote",
  "2,0": "Nonno",
  "2,1": "Zio",
  "2,2": "Cugino",
  "2,3": "Procugino",
  "2,4": "Pro-procugino",
  "3,0": "Bisnonno",
  "3,1": "Prozio (nonno)",
  "3,2": "Procugino (nonno)",
  "3,3": "Cugino 2°",
  "3,4": "Procugino 2°",
  "4,0": "Trisnonno",
  "4,1": "Prozio (bisnonno)",
  "4,2": "Pro-procugino (bisnonno)",
  "4,3": "Procugino 2° (bisnonno)",
  "4,4": "Cugino 3°",
};

export const percentualeParentela: { [key: string]: number } = {
  "0,0": 100,
  "0,1": 90,
  "0,2": 70,
  "0,3": 40,
  "0,4": 20,
  "1,0": 90,
  "1,1": 80,
  "1,2": 60,
  "1,3": 35,
  "1,4": 18,
  "2,0": 70,
  "2,1": 60,
  "2,2": 50,
  "2,3": 30,
  "2,4": 13,
  "3,0": 40,
  "3,1": 35,
  "3,2": 30,
  "3,3": 25,
  "3,4": 8,
  "4,0": 20,
  "4,1": 18,
  "4,2": 13,
  "4,3": 8,
  "4,4": 5,
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
