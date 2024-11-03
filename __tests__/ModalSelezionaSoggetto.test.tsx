import React from "react";
import { fireEvent, waitFor } from "@testing-library/react";
import ModalSelezionaSoggetto from "@/components/ModalSelezionaSoggetto";
import { vi } from "vitest";
import { render } from "@/setup-test";
import { soggetti } from "./Soggetti/Soggetti";

describe("ModalSelezionaSoggetto", () => {
  it("dovrebbe renderizzare il modal e consentire di selezionare un soggetto", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    const { getByText, getByTestId, queryByText } = render(
      <ModalSelezionaSoggetto
        isOpen={true}
        annulla={vi.fn()}
        isLoading={false}
        soggetti={soggetti}
        submit={mockSubmit}
      />
    );

    // Verifica che il titolo del modal sia presente
    expect(getByText("Seleziona soggetto")).toBeInTheDocument();

    // Seleziona il soggetto
    const selectInput = getByTestId("soggetto-select");
    fireEvent.mouseDown(selectInput);
    const soggettoOption1 = getByText("48XA-2023-14");
    fireEvent.click(soggettoOption1);

    // Clicca sul bottone di selezione
    fireEvent.click(getByText("Seleziona"));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(soggetti[0]);
    });
  });

  it("dovrebbe mostrare un messaggio di errore se non viene selezionato alcun soggetto", async () => {
    const mockSubmit = vi.fn();
    const { getByText, getByRole } = render(
      <ModalSelezionaSoggetto
        isOpen={true}
        annulla={vi.fn()}
        isLoading={false}
        soggetti={soggetti}
        submit={mockSubmit}
      />
    );

    // Clicca sul bottone di selezione senza selezionare un soggetto
    fireEvent.click(getByText("Seleziona"));

    // Verifica che il messaggio di errore sia presente
    expect(getByText("Seleziona un soggetto")).toBeInTheDocument();
  });

  it("dovrebbe chiamare la funzione 'annulla' quando il modal viene chiuso", () => {
    const mockAnnula = vi.fn();
    const { getByText } = render(
      <ModalSelezionaSoggetto
        isOpen={true}
        annulla={mockAnnula}
        isLoading={false}
        soggetti={soggetti}
        submit={vi.fn()}
      />
    );

    fireEvent.click(getByText("Annulla"));
    expect(mockAnnula).toHaveBeenCalled();
  });
});
