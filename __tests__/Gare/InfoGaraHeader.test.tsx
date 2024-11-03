import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { GaraStatus } from "@prisma/client";
import { render } from "@/setup-test";
import InfoGaraHeader from "@/components/gare/id/InfoGaraHeader";
import { debug } from "vitest-preview";

// Mock per la funzione formatData
vi.mock("@/lib/helper", () => ({
  formatData: vi.fn((data) => data.toLocaleDateString()),
}));

describe("InfoGaraHeader", () => {
  const mockGara = {
    id: "dkfrfhjdvb39",
    titolo: "Canarini gialli",
    data: new Date("2024-11-15T00:00:00Z"),
    tipologia: "Corsa",
    citta: "Roma",
    immagine: "https://example.com/immagine.jpg",
    nazioneId: 1,
    createdAt: new Date(),
    isDeleted: false,
    prezzo: 25.0,
    capienza: 100,
    stato: GaraStatus.PUBBLICA,
    nazione: { id: 1, nome: "Italia", sigla: "IT" },
    _count: { iscrizioni: 0 },
    iscrizioni: [],
    ordiniIscrizioni: [],
  };

  test("renderizza titolo e icona", () => {
    render(<InfoGaraHeader gara={mockGara} />);
    debug();
    expect(screen.getByText("Canarini gialli")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /italia/i })).toBeInTheDocument();
  });

  test("visualizza la data e il tipo corretti", () => {
    render(<InfoGaraHeader gara={mockGara} />);
    expect(screen.getByText(/data gara:/i)).toBeInTheDocument();
    expect(screen.getByText("15/11/2024")).toBeInTheDocument(); // Assicurati che il formato sia corretto
    expect(screen.getByText(/tipologia:/i)).toBeInTheDocument();
    expect(screen.getByText("Corsa")).toBeInTheDocument();
  });

  test("mostra i posti disponibili", () => {
    render(<InfoGaraHeader gara={mockGara} />);
    expect(screen.getByText(/posti disponibili:/i)).toBeInTheDocument();
    expect(screen.getByText("100/100")).toBeInTheDocument();
  });

  test("visualizza città e nazione", () => {
    render(<InfoGaraHeader gara={mockGara} />);
    expect(screen.getByText(/città:/i)).toBeInTheDocument();
    expect(screen.getByText("Roma")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /italia/i })).toHaveAttribute(
      "src",
      "https://flagcdn.com/h20/it.jpg"
    );
  });
});
