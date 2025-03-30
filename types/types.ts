import { Inserzione, Prisma, RichiestaRegistrazione, Soggetto } from "@prisma/client";

export enum Sesso {
  Maschio = "Maschio",
  Femmina = "Femmina",
  InAttesa = "In Attesa",
}

export type ProfiloWithAllevatore = Prisma.ProfiloGetPayload<{
  include: { allevatore: true };
}>;

export type GaraWithNazioneAndCountIscrizioni = Prisma.GaraGetPayload<{
  include: { nazione: true; _count: { select: { iscrizioni: true } } };
}>;

export type TransazioneWithCategoria = Prisma.TransazioneGetPayload<{
  include: { categoria: true };
}>;

export type CovataWithGenitori = Prisma.CovataGetPayload<{
  include: { madre: true; padre: true };
}>;

export type CovataWithGenitoriAndFigliWithVendite = Prisma.CovataGetPayload<{
  include: {
    madre: true;
    padre: true;
    figli: {
      include: {
        inserzioniVendita: true;
      };
    };
  };
}>;

export type CovataWithGenitoriAndCountFigli = Prisma.CovataGetPayload<{
  include: { madre: true; padre: true; _count: { select: { figli: true } } };
}>;

export type SoggettoWithVendite = {
  inserzioniVendita?: Inserzione[];
} & Soggetto;

export type SoggettoWithGenitori = Prisma.SoggettoGetPayload<{
  include: { covata: { select: { idMadre: true; idPadre: true } } };
}>;

export type SoggettoWithIscrizioniWithGaraWithNazione = Prisma.SoggettoGetPayload<{
  include: {
    iscrizioni: { include: { gara: { include: { nazione: true } } } };
  };
}>;

export type IscrizioniWithGaraWithNazione = Prisma.IscrizioneGetPayload<{
  include: {
    gara: { include: { nazione: true } };
  };
}>;

export type IscrizioniWithGara = Prisma.IscrizioneGetPayload<{
  include: {
    gara: true;
  };
}>;

export type BudgetRequest = {
  budget: Prisma.ProfiloGetPayload<{ select: { budget: true } }>;
  spese: Prisma.GetTransazioneAggregateType<{ _sum: { prezzo: true } }>;
};

export type SpesaQueryResult = {
  anno: number;
  totale: number;
  categoria: string;
};

export type Parentela = {
  nome: string;
  percentuale: number;
  grado: number;
  colore: string;
};

export type SoggettoWithParentela = {
  soggetto: Soggetto;
  parentela: Parentela | null;
};

export type SoggettoWithVenditeWithParentela = {
  soggetto: SoggettoWithVendite;
  parentela: Parentela | null;
};

export type IncassoQueryResult = { mese: number; totale: number; anno: number };

export type ApiResponse<T = any> = { error: true; message: string } | { error: false; result: T };

export type GaraWithIscrizioniWithSoggettoAndProfiloWithAllevatore = Prisma.GaraGetPayload<{
  include: {
    iscrizioni: {
      include: {
        soggetto: true;
        profilo: { include: { allevatore: true } };
      };
    };
  };
}>;

export type IscrizioneWithSoggettoAndProfiloWithAllevatore = Prisma.IscrizioneGetPayload<{
  include: {
    soggetto: true;
    profilo: { include: { allevatore: true } };
  };
}>;

export type RichiestaRegistrazioneWithCount = {
  richiesteRegistrazione: RichiestaRegistrazione[];
  count: number;
};

export type InserzioneWithSoggettoAndAllevatoreAndRisultatiGare = Prisma.InserzioneGetPayload<{
  include: {
    soggetto: {
      include: {
        iscrizioni: {
          select: {
            gara: {
              select: {
                titolo: true;
                data: true;
              };
            };
            posizione: true;
          };
        };
      };
    };
    profilo: { select: { allevatore: true } };
  };
}>;
