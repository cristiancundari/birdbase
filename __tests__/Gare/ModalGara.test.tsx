import { screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ModalGara from "@/components/gare/ModalGara";
import { render } from "@/setup-test";
import { debug } from "vitest-preview";

// Mock delle dipendenze
vi.mock("@/lib/apiFetch", () => ({
  apiFetch: {
    get: vi.fn().mockResolvedValue({ data: [], error: null }),
  },
}));

describe("Componente ModalGara", () => {
  const mockSubmit = vi.fn();
  const mockAnnulla = vi.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
    mockAnnulla.mockClear();
  });

  it("si rende correttamente quando aperto", () => {
    render(
      <ModalGara
        isOpen={true}
        annulla={mockAnnulla}
        submit={mockSubmit}
        modalData={null}
      />
    );

    expect(screen.getByText(/Aggiungi Gara/i)).toBeInTheDocument();
  });

  it("valida correttamente i campi del modulo", async () => {
    render(
      <ModalGara
        isOpen={true}
        annulla={mockAnnulla}
        submit={mockSubmit}
        modalData={null}
      />
    );

    fireEvent.click(screen.getByText(/Salva/i));

    expect(await screen.findByText(/Inserire Titolo/i)).toBeInTheDocument();
    expect(await screen.findByText(/Inserire Data/i)).toBeInTheDocument();
    expect(await screen.findByText(/Inserire la città/i)).toBeInTheDocument();
  });

  it("invia il modulo con i valori corretti", async () => {
    render(
      <ModalGara
        isOpen={true}
        annulla={mockAnnulla}
        submit={mockSubmit}
        modalData={null}
      />
    );

    // Compila il modulo con dati validi
    fireEvent.change(screen.getByLabelText(/Titolo/i), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByLabelText(/Tipologia/i), {
      target: { value: "Test Type" },
    });
    fireEvent.change(screen.getByLabelText(/Città/i), {
      target: { value: "Test City" },
    });
    fireEvent.change(screen.getByLabelText(/Capienza/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Data/i), {
      target: { value: "10/10/2024" },
    });

    // Invia il modulo
    fireEvent.click(screen.getByText(/Salva/i));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          form: expect.objectContaining({
            titolo: "Test Title",
            tipologia: "Test Type",
            citta: "Test City",
            capienza: 10,
          }),
        })
      );
    });
  });

  it("chiama annulla quando il modulo viene chiuso", () => {
    render(
      <ModalGara
        isOpen={true}
        annulla={mockAnnulla}
        submit={mockSubmit}
        modalData={null}
      />
    );

    fireEvent.click(screen.getByText(/Annulla/i));
    expect(mockAnnulla).toHaveBeenCalled();
  });

  it("carica le nazioni e le visualizza nel campo di selezione", async () => {
    // Mock della risposta per le nazioni
    vi.mock("@/lib/apiFetch", () => ({
      apiFetch: {
        get: vi.fn().mockResolvedValue({
          data: [
            { id: 1, nome: "Italia" },
            { id: 2, nome: "Francia" },
          ],
          error: null,
        }),
      },
    }));

    render(
      <ModalGara
        isOpen={true}
        annulla={mockAnnulla}
        submit={mockSubmit}
        modalData={null}
      />
    );

    // Verifica se le nazioni sono caricate
    expect(await screen.findByText("Italia")).toBeInTheDocument();
    expect(await screen.findByText("Francia")).toBeInTheDocument();
  });
});
