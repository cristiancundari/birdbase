import Incassi from "@/components/gare/id/incassi/Incassi";
import { render } from "@/setup-test";
import { screen } from "@testing-library/react";
import { mockGara } from "../Gara";
import { GaraWithNazioneAndCountIscrizioni } from "@/types/types";
import { beforeEach, describe, expect, test } from "vitest";

describe("Incassi", () => {
  const fakeGara: GaraWithNazioneAndCountIscrizioni = {
    ...mockGara,
    prezzo: 10.0,
    _count: {
      iscrizioni: 5,
    },
  };

  beforeEach(() => {
    render(<Incassi gara={fakeGara} />);
  });

  test('dovrebbe mostrare il titolo "Dettagli Gara"', () => {
    expect(screen.getByText("Dettagli Gara")).toBeInTheDocument();
  });

  test("dovrebbe mostrare il prezzo formattato correttamente", () => {
    expect(screen.getByText("Prezzo: 10,00 €")).toBeInTheDocument();
  });

  test("dovrebbe mostrare il numero di soggetti iscritti", () => {
    expect(screen.getByText("Soggetti Iscritti: 5")).toBeInTheDocument();
  });

  test("dovrebbe calcolare e mostrare gli incassi correttamente", () => {
    expect(screen.getByText("Incassi: 50,00 €")).toBeInTheDocument();
  });
});
