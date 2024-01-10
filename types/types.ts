import { Prisma } from "@prisma/client";

export enum Sesso {
  Maschio = "Maschio",
  Femmina = "Femmina",
  InAttesa = "In Attesa",
}

export type GaraWithNazioneAndCountIscrizioni = Prisma.GaraGetPayload<{
  include: { nazione: true; _count: { select: { iscrizioni: true } } };
}>;

export type TransazioneWithCategoria = Prisma.TransazioneGetPayload<{
  include: { categoria: true };
}>;

export type CovataWithGenitori = Prisma.CovataGetPayload<{
  include: { madre: true; padre: true };
}>;

export type CovataWithGenitoriAndFigli = Prisma.CovataGetPayload<{
  include: { madre: true; padre: true; figli: true };
}>;

export type CovataWithGenitoriAndCountFigli = Prisma.CovataGetPayload<{
  include: { madre: true; padre: true; _count: { select: { figli: true } } };
}>;

export type SoggettoWithGenitori = Prisma.SoggettoGetPayload<{
  include: { covata: { select: { idMadre: true; idPadre: true } } };
}>;

export type ApiResponse<T = any> =
  | { error: true; message: string }
  | { error: false; result: T };
