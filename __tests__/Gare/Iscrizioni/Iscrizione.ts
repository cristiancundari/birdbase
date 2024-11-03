import { soggetti } from "@/__tests__/Soggetti/Soggetti";
import { IscrizioneWithSoggettoAndProfiloWithAllevatore } from "@/types/types";

export const mockIscrizione: IscrizioneWithSoggettoAndProfiloWithAllevatore = {
  id: "iscrizione-1",
  garaId: "gara-1",
  importo: 100,
  createdAt: new Date(),
  soggettoId: soggetti[0].id,
  soggetto: {
    ...soggetti[0],
    rna: "RNA123",
    numero: "987",
    anno: "2023",
  },
  profiloId: "profilo-1",
  profilo: {
    id: "profilo-1",
    budget: 100,
    googleRefreshToken: "token",
    rna: "RNA123",
    ruolo: "USER",
    allevatore: {
      rna: "RNA123",
      nome: "Mario",
      cognome: "Rossi",
    },
  },
  voto: 10,
  posizione: 1,
};
