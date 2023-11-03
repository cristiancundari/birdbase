import { Prisma } from "@prisma/client"

export enum Sesso {
  Maschio = "Maschio",
  Femmina = "Femmina",
  InAttesa = "In Attesa"
};

export type GaraWithNazione = Prisma.GaraGetPayload<{
  include: {nazione:true}
}>