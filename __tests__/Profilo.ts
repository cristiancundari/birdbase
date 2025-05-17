import { Role } from "@prisma/client";

export const mockProfilo = {
  id: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
  budget: 100,
  googleRefreshToken: "token",
  rna: "RNA123",
  ruolo: Role.USER,
  allevatore: {
    rna: "RNA123",
    nome: "Mario",
    cognome: "Rossi",
  },
  formulaData: "1",
  formulaParentela: "1",
  percentualeFormulaData: 50,
  limiteLivelliParentela: 5,
};
