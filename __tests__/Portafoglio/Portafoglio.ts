import {
  BudgetRequest,
  IncassoQueryResult,
  SpesaQueryResult,
  TransazioneWithCategoria,
} from "@/types/types";
import { CategoriaSpesa } from "@prisma/client";

export const budget: BudgetRequest = {
  budget: {
    budget: 308,
  },
  spese: {
    _sum: {
      prezzo: -25.22,
    },
  },
};

export const transazioni: TransazioneWithCategoria[] = [
  {
    id: 18,
    createdAt: new Date("2024-01-12T09:54:31.997Z"),
    categoriaId: 2,
    data: new Date("2024-01-10T00:00:00.000Z"),
    prezzo: -25.22,
    descrizione: "ghj",
    modificabile: true,
    profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
    categoria: {
      id: 2,
      nome: "Medicine",
    },
  },
  {
    id: 10,
    createdAt: new Date("2023-12-05T11:03:23.325Z"),
    categoriaId: 3,
    data: new Date("2023-12-15T00:00:00.000Z"),
    prezzo: 180,
    descrizione: "bellissimo",
    modificabile: true,
    profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
    categoria: {
      id: 3,
      nome: "Soggetti",
    },
  },
  {
    id: 12,
    createdAt: new Date("2023-12-05T15:22:32.562Z"),
    categoriaId: 4,
    data: new Date("2023-12-08T00:00:00.000Z"),
    prezzo: -100,
    descrizione: "Gabbia n 5",
    modificabile: true,
    profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
    categoria: {
      id: 4,
      nome: "Gabbie",
    },
  },
  {
    id: 16,
    createdAt: new Date("2023-12-05T21:24:03.412Z"),
    categoriaId: 3,
    data: new Date("2023-12-06T00:00:00.000Z"),
    prezzo: 160,
    descrizione: "Pinù",
    modificabile: true,
    profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
    categoria: {
      id: 3,
      nome: "Soggetti",
    },
  },
  {
    id: 15,
    createdAt: new Date("2023-12-05T21:23:07.082Z"),
    categoriaId: 2,
    data: new Date("2023-12-04T00:00:00.000Z"),
    prezzo: -5.6,
    descrizione: "Necton C",
    modificabile: true,
    profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
    categoria: {
      id: 2,
      nome: "Medicine",
    },
  },
  {
    id: 14,
    createdAt: new Date("2023-12-05T16:20:30.713Z"),
    categoriaId: 5,
    data: new Date("2023-12-02T00:00:00.000Z"),
    prezzo: -158.72,
    descrizione: "Robot pulizie Roomba su Amazon.de",
    modificabile: true,
    profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
    categoria: {
      id: 5,
      nome: "Altro",
    },
  },
  {
    id: 8,
    createdAt: new Date("2023-12-01T09:38:24.740Z"),
    categoriaId: 4,
    data: new Date("2023-11-28T00:00:00.000Z"),
    prezzo: -10.2,
    descrizione: "Necton C, Necton D",
    modificabile: true,
    profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
    categoria: {
      id: 4,
      nome: "Gabbie",
    },
  },
  {
    id: 4,
    createdAt: new Date("2023-11-29T13:39:19.678Z"),
    categoriaId: 3,
    data: new Date("2023-11-28T00:00:00.000Z"),
    prezzo: 524.12,
    descrizione: "Pinù :(",
    modificabile: true,
    profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
    categoria: {
      id: 3,
      nome: "Soggetti",
    },
  },
  {
    id: 3,
    createdAt: new Date("2023-11-29T13:32:57.769Z"),
    categoriaId: 3,
    data: new Date("2023-11-16T00:00:00.000Z"),
    prezzo: -90,
    descrizione: "venduto chopin",
    modificabile: true,
    profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
    categoria: {
      id: 3,
      nome: "Soggetti",
    },
  },
  {
    id: 2,
    createdAt: new Date("2023-11-29T13:30:38.987Z"),
    categoriaId: 3,
    data: new Date("2023-11-16T00:00:00.000Z"),
    prezzo: -12,
    descrizione: "venduto pinù",
    modificabile: true,
    profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
    categoria: {
      id: 3,
      nome: "Soggetti",
    },
  },
  {
    id: 1,
    createdAt: new Date("2023-11-29T13:30:08.335Z"),
    categoriaId: 1,
    data: new Date("2023-11-08T00:00:00.000Z"),
    prezzo: -10.1,
    descrizione: "prova",
    modificabile: true,
    profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
    categoria: {
      id: 1,
      nome: "Alimenti",
    },
  },
];

export const spese: SpesaQueryResult[] = [
  {
    anno: 2023,
    totale: -10.1,
    categoria: "Alimenti",
  },
  {
    anno: 2023,
    totale: -158.72,
    categoria: "Altro",
  },
  {
    anno: 2023,
    totale: -110.2,
    categoria: "Gabbie",
  },
  {
    anno: 2023,
    totale: -5.6,
    categoria: "Medicine",
  },
  {
    anno: 2023,
    totale: -102,
    categoria: "Soggetti",
  },
  {
    anno: 2024,
    totale: -25.22,
    categoria: "Medicine",
  },
];

export const incassi: IncassoQueryResult[] = [
  {
    mese: 11,
    totale: 524.12,
    anno: 2023,
  },
  {
    mese: 12,
    totale: 340,
    anno: 2023,
  },
];

export const categorie: CategoriaSpesa[] = [
  {
    id: 1,
    nome: "Alimenti",
  },
  {
    id: 2,
    nome: "Medicine",
  },
  {
    id: 3,
    nome: "Soggetti",
  },
  {
    id: 4,
    nome: "Gabbie",
  },
  {
    id: 5,
    nome: "Altro",
  },
];
