import React from "react";
import { screen } from "@testing-library/react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { IscrizioneWithSoggettoAndProfiloWithAllevatore } from "@/types/types";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";
import Classifica from "@/components/gare/id/classifica/Classifica";
import { render } from "@/setup-test";
import { debug } from "vitest-preview";

// Mock del provider Supabase
vi.mock("@/providers/SupabaseProvider", () => ({
  useSupabase: vi.fn(),
}));

describe("Classifica", () => {
  const mockIscrizioni: IscrizioneWithSoggettoAndProfiloWithAllevatore = {
    id: "1",
    garaId: "1",
    soggettoId: "1",
    createdAt: new Date("2024-05-01T00:00:00Z"),
    importo: 100.0,
    posizione: 1,
    voto: 98,
    profiloId: "user-1",
    profilo: {
      id: "1",
      rna: "48XA",
      ruolo: "USER",
      budget: 100,
      googleRefreshToken: "shdgystrfs",
      allevatore: {
        cognome: "Savoca",
        nome: "Antonello",
        rna: "48XA",
      },
      formulaData: "1",
      formulaParentela: "1",
      percentualeFormulaData: 50,
      limiteLivelliParentela: 4,
    },
    soggetto: {
      id: "1",
      anno: "2024",
      dataNascita: new Date("2024-05-01T00:00:00Z"),
      isMorto: false,
      numero: "45",
      rna: "48XA",
      profiloId: "1",
      sesso: false,
      gabbia: 5,
      preferito: true,
      note: "test",
      avatar: "immagine",
      covataId: null,
    },
  };

  beforeEach(() => {
    (useSupabase as Mock).mockReturnValue({
      user: { id: "user-1", ruolo: "UTENTE" }, // Simula un utente normale
    });
  });

  test("visualizza la classifica totale", () => {
    render(<Classifica iscrizioni={[mockIscrizioni]} />);

    expect(screen.getByText("Classifica")).toBeInTheDocument();
    expect(screen.getAllByText(/48XA/).length).toBeGreaterThan(0);
  });

  test("visualizza la classifica personale per l'utente", () => {
    render(<Classifica iscrizioni={[mockIscrizioni]} />);
    expect(screen.getByText("Classifica Personale")).toBeInTheDocument();
    expect(screen.getAllByText(/48XA/).length).toBeGreaterThan(0);
  });

  test("non visualizza la classifica personale per l'amministratore", () => {
    (useSupabase as Mock).mockReturnValue({
      user: { id: "admin", ruolo: "ADMIN" }, // Simula un amministratore
    });
    render(<Classifica iscrizioni={[mockIscrizioni]} />);

    expect(screen.queryByText("Classifica Personale")).not.toBeInTheDocument();
  });
});
