import { prisma } from "@/lib/prisma";
import { ProfiloWithAllevatore, SoggettoWithGenitori, SoggettoWithParentela } from "@/types/types";
import { Profilo, Soggetto } from "@prisma/client";

const LIMITE_LIVELLI = 4;

// Questa funzione ritorna true se il soggetto ha un'età maggiore di 9 mesi e quindi in grado di riprodursi
function puoRiprodursi(dataNascita: Date) {
  const dataCorrente = new Date();

  let diffMesi = (dataCorrente.getFullYear() - dataNascita.getFullYear()) * 12 + dataCorrente.getMonth() - dataNascita.getMonth();

  return diffMesi > 9;
}

export function elaboraParenteleSoggetto(
  listaSoggetti: SoggettoWithGenitori[],
  soggetto: SoggettoWithGenitori,
  profilo: ProfiloWithAllevatore,
  onlyPartners?: boolean
): SoggettoWithParentela[] {
  // Crea un dizionario in cui la chiave rappresenta l'ID del soggetto e il valore è il soggetto stesso per una più facile ricerca
  const dictSoggetti: Record<string, SoggettoWithGenitori> = {};
  for (let s of listaSoggetti) {
    dictSoggetti[s.id] = s;
  }

  const parentiSoggetto = calcolaLivelliParentela(soggetto, dictSoggetti, profilo.limiteLivelliParentela);
  // onlyPartners è true se si vogliono escludere dal calcolo i soggetti di sesso opposto e quelli troppo giovani per riprodursi
  const partners = onlyPartners
    ? listaSoggetti.filter((s) => s.sesso == !soggetto.sesso && s.profiloId === profilo.id && puoRiprodursi(s.dataNascita))
    : listaSoggetti.filter((p) => p.profiloId === profilo.id);

  const result = partners.map((partner) => {
    const parentiPartner = calcolaLivelliParentela(partner, dictSoggetti, profilo.limiteLivelliParentela);
    // Confronta i livelli di parentela del soggetto con quelli del partner dell'iterazione corrente per ottenere il grado di parentela
    const gradoParentela = checkParentele(parentiSoggetto, parentiPartner);
    if (gradoParentela && gradoParentela[0] + gradoParentela[1] <= profilo.limiteLivelliParentela) {
      const parentela = getDatiParentela(gradoParentela[0], gradoParentela[1]);
      return {
        soggetto: { ...partner, covata: undefined } as Soggetto,
        parentela: parentela,
      };
    } else {
      return {
        soggetto: { ...partner, covata: undefined } as Soggetto,
        parentela: null,
      };
    }
  });

  const mieiSoggetti = result.filter((p) => p.soggetto.profiloId === profilo.id);

  return onlyPartners
    ? mieiSoggetti
    : mieiSoggetti
        .filter((p) => p.parentela !== null && p.soggetto.id !== soggetto.id)
        .sort((a, b) => b.parentela!.percentuale - a.parentela!.percentuale);
}

//Restituisce un array (di LIMITE_LIVELLI + 1 elementi) dove ogni elemento rappresenta un livello di parentela
export function calcolaLivelliParentela(
  soggetto: SoggettoWithGenitori,
  dictSoggetti: Record<string, SoggettoWithGenitori>,
  limiteLivelli = LIMITE_LIVELLI
): [string, string][][] {
  const res: [string, string][][] = [];
  // Inserisce il livello zero nell'array in cui è presente solo il soggetto stesso
  res.push([[soggetto.id, ""]]);

  for (let lvl = 0; lvl < limiteLivelli; lvl++) {
    const last = res[lvl];
    const step: [string, string][] = [];
    // la tupla contiene gli id di padre e madre del soggetto dell'iterazione corrente  es. ["SOGG_idPadre", "SOGG_idMadre"]
    for (let tupla of last) {
      for (let idSoggTup of tupla) {
        if (idSoggTup) {
          // escludiamo il caso del livello 0 in cui il secondo id è ""  es. ["SOGG_id", ""]
          const covata = dictSoggetti[idSoggTup].covata;
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

export function checkParentele(a: [string, string][][], b: [string, string][][]) {
  const liv = Math.max(a.length, b.length);
  for (let j = 0; j < liv; j++) {
    // I due cicli for interni confrontano tutte le combinazioni senza ripetizione dei due alberi di livelli
    for (let i = 0; i <= j; i++) {
      if (confrontaLivelli(a[i], b[j])) {
        return [i, j];
      }
      if (i !== j && confrontaLivelli(a[j], b[i])) {
        return [j, i];
      }
    }
  }
  return false;
}

// ritorna true se almeno un soggetto è presente in entrambi i livelli confrontati
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

// ritorna true se almeno un soggetto è presente in entrambe le tuple
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

function getDatiParentela(grado_A: number, grado_B: number) {
  const grado = grado_A + grado_B;
  const gradoStr = `${grado_A},${grado_B}`;

  let nomenclatura = datiParentela[gradoStr];

  if (nomenclatura == undefined) {
    nomenclatura = `Parentela di ${grado}° grado`;
  }

  let gradoCalcolato = grado;
  if (Math.min(grado_A, grado_B) !== 0) {
    gradoCalcolato--;
  }

  const percentuale = Math.floor(Math.min(1, 0.8 ** (gradoCalcolato - 1)) * 100);

  return {
    nome: nomenclatura,
    percentuale: percentuale,
    grado: grado,
    colore: coloreParentela(percentuale),
  };
}

const datiParentela: {
  [key: string]: string;
} = {
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

export function coloreParentela(percentuale: number) {
  if (percentuale >= 80) {
    return "red";
  } else if (percentuale >= 50) {
    return "orange";
  } else {
    return "teal";
  }
}
