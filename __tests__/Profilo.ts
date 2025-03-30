import { Role } from "@prisma/client";

export const mockProfilo = {
  id: "profilo-1",
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
