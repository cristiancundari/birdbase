import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Promemoria } from "@prisma/client";
import { format } from "date-fns";
import { render } from "@/setup-test";
import PromemoriaComp from "@/components/promemoria/PromemoriaComp";
import { debug } from "vitest-preview";

// Mock dei dati del promemoria
const mockPromemoria: Promemoria = {
  id: 1,
  titolo: "Test Promemoria",
  descrizione: "Descrizione del test",
  ora: new Date(),
  completato: false,
  priorita: "ALTA",
  profiloId: "1",
  data: new Date("2023-11-01T10:00:00Z"),
  googlePromemoriaId: null,
};

describe("PromemoriaComp", () => {
  const modalEliminaMock = vi.fn();
  const modalModificaMock = vi.fn();

  beforeEach(() => {
    render(
      <PromemoriaComp
        value={mockPromemoria}
        modalElimina={modalEliminaMock}
        modalModifica={modalModificaMock}
      />
    );
  });

  it("renderizza il titolo e la descrizione del promemoria", () => {
    expect(screen.getByText(mockPromemoria.titolo)).toBeInTheDocument();
    expect(screen.getByText(mockPromemoria.descrizione)).toBeInTheDocument();
  });

  it("renderizza l'ora corretta", () => {
    const formattedTime = format(mockPromemoria.ora, "HH:mm");
    expect(screen.getByText(formattedTime)).toBeInTheDocument();
  });

  it("visualizza l'icona corretta in base allo stato di completamento", () => {
    // Completato = false
    expect(screen.getByLabelText("Settings")).toBeInTheDocument();
    expect(screen.getByTestId("non-completato-test")).toBeInTheDocument();

    const updatedPromemoria = { ...mockPromemoria, completato: true };
    render(
      <PromemoriaComp
        value={updatedPromemoria}
        modalElimina={modalEliminaMock}
        modalModifica={modalModificaMock}
      />
    );

    expect(screen.getByTestId("completato-test")).toBeInTheDocument();
  });

  it("chiama modalModifica quando si clicca sul pulsante Modifica", async () => {
    fireEvent.click(screen.getByTestId("MenuButton"));
    await waitFor(() => {
      const modificaButton = screen.getByTestId("ModificaButton");
      fireEvent.click(modificaButton);
    });
    await waitFor(() => {
      expect(modalModificaMock).toHaveBeenCalledWith(mockPromemoria);
    });
  });

  it("chiama modalElimina quando si clicca sul pulsante Elimina", async () => {
    fireEvent.click(screen.getByTestId("MenuButton"));
    await waitFor(() => {
      const eliminaButton = screen.getByTestId("EliminaButton");
      fireEvent.click(eliminaButton);
    });
    await waitFor(() => {
      expect(modalEliminaMock).toHaveBeenCalledWith(mockPromemoria.id);
    });
  });

  it("visualizza il pulsante del menu", () => {
    const menuButton = screen.getByTestId("MenuButton");
    expect(menuButton).toBeInTheDocument();
  });
});
