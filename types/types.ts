import { Prisma } from "@prisma/client";

export enum Sesso {
  Maschio = "Maschio",
  Femmina = "Femmina",
  InAttesa = "In Attesa",
}

export type GaraWithNazione = Prisma.GaraGetPayload<{
  include: { nazione: true };
}>;

export type TransazioneWithCategoria = Prisma.TransazioneGetPayload<{
  include: { categoria: true };
}>;
export enum Ruolo {
  Admin = "admin",
  User = "authenticated",
}

export type ApiResponse =
  | { error: true; message: string }
  | { error: false; result: any };
