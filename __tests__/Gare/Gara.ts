import { GaraWithNazioneAndCountIscrizioni } from "@/types/types"; // Assicurati di importare il tipo corretto

export const mockGara: GaraWithNazioneAndCountIscrizioni = {
  id: "1",
  titolo: "Test Gara",
  data: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 giorni da ora
  tipologia: "Canarini",
  citta: "Roma",
  immagine: null,
  prezzo: 100,
  capienza: 50,
  _count: { iscrizioni: 20 },
  isDeleted: false,
  stato: "BOZZA",
  createdAt: new Date(),
  nazioneId: 1,
  nazione: {
    id: 1,
    nome: "Italia",
    sigla: "IT",
  },
};
