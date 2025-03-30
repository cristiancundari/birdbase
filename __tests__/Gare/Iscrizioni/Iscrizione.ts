import { mockProfilo } from "@/__tests__/Profilo";
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
  profilo: mockProfilo,
  voto: 10,
  posizione: 1,
};
