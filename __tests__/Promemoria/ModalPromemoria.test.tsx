// ModalPromemoria.test.tsx
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { $Enums } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@/setup-test";
import ModalPromemoria from "@/components/promemoria/ModalPromemoria";
import { debug } from "vitest-preview";
// Dati mock
const mockSubmit = vi.fn();
const mockAnnulla = vi.fn();

describe("ModalPromemoria", () => {
  beforeEach(() => {
    mockSubmit.mockClear();
    mockAnnulla.mockClear();
  });

  it("viene visualizzato correttamente quando è aperto", () => {
    render(
      <ModalPromemoria
        isOpen={true}
        annulla={mockAnnulla}
        submit={mockSubmit}
        modalData={null}
      />
    );

    expect(screen.getByText("Aggiungi Promemoria")).toBeInTheDocument();
    expect(screen.getByLabelText("Titolo")).toBeInTheDocument();
    expect(screen.getByLabelText("Descrizione")).toBeInTheDocument();
    expect(screen.getByLabelText("Data e Ora")).toBeInTheDocument();
    expect(screen.getByTestId("priorita-test")).toBeInTheDocument();
  });

  it("valida i campi obbligatori", async () => {
    render(
      <ModalPromemoria
        isOpen={true}
        annulla={mockAnnulla}
        submit={mockSubmit}
        modalData={null}
      />
    );

    fireEvent.click(screen.getByText("Salva"));

    await waitFor(() => {
      expect(screen.getByText("Inserire un titolo")).toBeInTheDocument();
      expect(screen.getByText("Inserire Data")).toBeInTheDocument();
    });
  });

  it("chiama submit con i valori corretti", async () => {
    render(
      <ModalPromemoria
        isOpen={true}
        annulla={mockAnnulla}
        submit={mockSubmit}
        modalData={null}
      />
    );

    fireEvent.change(screen.getByLabelText("Titolo"), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByLabelText("Descrizione"), {
      target: { value: "Test Description" },
    });

    fireEvent.click(screen.getByLabelText("Data e Ora"));
    await waitFor(() => {
      fireEvent.click(screen.getByText("13"));
    });

    fireEvent.click(screen.getByText("ALTA"));

    fireEvent.click(screen.getByText("Salva"));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        titolo: "Test Title",
        descrizione: "Test Description",
        dataOra: expect.any(Date),
        priorita: $Enums.Priorita.ALTA,
        completato: false,
      });
    });
  });

  it("chiama annulla quando viene annullato", () => {
    render(
      <ModalPromemoria
        isOpen={true}
        annulla={mockAnnulla}
        submit={mockSubmit}
        modalData={null}
      />
    );

    fireEvent.click(screen.getByText("Annulla"));
    expect(mockAnnulla).toHaveBeenCalled();
  });
});
