import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { apiFetch } from "@/lib/apiFetch";
import {
  SoggettoWithIscrizioniWithGaraWithNazione,
  SoggettoWithParentela,
} from "@/types/types";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";
import { render } from "@/setup-test";
import InfoSoggetto from "@/components/home/id/InfoSoggetto";
import { debug } from "vitest-preview";

// Mock del provider Supabase
vi.mock("@/providers/SupabaseProvider", () => ({
  useSupabase: vi.fn(),
}));

// Mock della funzione apiFetch
vi.mock("@/lib/apiFetch", () => ({
  apiFetch: {
    get: vi.fn(),
  },
}));

// Mock per il componente InfoGabbia
vi.mock("@/components/InfoGabbia", () => ({
  default: () => <div>Info Gabbia</div>,
}));

// Mock per il componente InfoNazione
vi.mock("@/components/InfoNazione", () => ({
  default: () => <div>Info Nazione</div>,
}));

// Mock per la funzione getIconSesso
vi.mock("@/components/IconsSesso", () => ({
  getIconSesso: vi.fn(() => <span>Sesso Icon</span>),
}));

describe("InfoSoggetto", () => {
  const mockSoggetto: SoggettoWithIscrizioniWithGaraWithNazione = {
    id: "vfsbtfdjdoa",
    rna: "RNA123",
    numero: "001",
    anno: "2024",
    avatar: null,
    sesso: true,
    covataId: null,
    isMorto: false,
    preferito: true,
    iscrizioni: [],
    gabbia: 5,
    dataNascita: new Date("2020-01-01"),
    note: "Note test",
    profiloId: "1",
  };

  const mockParentele: SoggettoWithParentela[] = [
    {
      soggetto: {
        ...mockSoggetto,
        rna: "RNA124",
      },
      parentela: {
        plurale: "Fratelli",
        colore: "blu",
        nome: "Fratello",
        percentuale: 100,
      },
    },
    {
      soggetto: {
        ...mockSoggetto,
        id: "parent-soggetto-2",
        rna: "RNA125",
        numero: "003",
        anno: "2024",
        sesso: true,
        dataNascita: new Date("2018-01-01"),
      },
      parentela: {
        plurale: "Figli",
        colore: "giallo",
        nome: "Figlio",
        percentuale: 100,
      },
    },
  ];

  beforeEach(() => {
    // Resetta i mock prima di ogni test
    vi.clearAllMocks();

    // Simula la risposta per la funzione apiFetch.get
    (apiFetch.get as Mock).mockResolvedValue({
      data: mockParentele,
      error: null,
    });

    // Simula l'utente
    (useSupabase as Mock).mockReturnValue({
      user: { id: "213", ruolo: "UTENTE" },
    });
  });

  test("renderizza correttamente le informazioni del soggetto", async () => {
    render(<InfoSoggetto soggetto={mockSoggetto} />);

    expect(screen.getByText("Stampa")).toBeInTheDocument();
    expect(screen.getByText(/RNA123/i)).toBeInTheDocument();
    expect(screen.getByText("Sesso:")).toBeInTheDocument();
    expect(screen.getByText("Info Gabbia")).toBeInTheDocument();
    expect(screen.getByText("Data di nascita: 01/01/2020")).toBeInTheDocument();

    // Verifica se le note sono visualizzate
    expect(screen.getByText("Note: Note test")).toBeInTheDocument();
  });

  test("visualizza correttamente la lista dei parenti", async () => {
    render(<InfoSoggetto soggetto={mockSoggetto} />);

    // Aspetta che la lista dei parenti venga caricata
    await waitFor(() =>
      expect(screen.getByText("Fratelli")).toBeInTheDocument()
    );
    expect(screen.getByText(/RNA124/i)).toBeInTheDocument();
    expect(screen.getByText(/RNA125/i)).toBeInTheDocument();
  });

  test("mostra un messaggio se non ci sono parenti", async () => {
    (apiFetch.get as Mock).mockResolvedValueOnce({ data: [], error: null });
    render(<InfoSoggetto soggetto={mockSoggetto} />);

    // Aspetta che venga visualizzato il messaggio "Nessun parente"
    await waitFor(() =>
      expect(screen.getByText("Nessun parente")).toBeInTheDocument()
    );
  });

  test("visualizza un caricamento durante il fetch delle parentele", () => {
    render(<InfoSoggetto soggetto={mockSoggetto} />);

    expect(screen.getByTestId("loader-test")).toBeInTheDocument();
  });
});
