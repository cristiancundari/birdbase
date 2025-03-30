import React from "react";
import { fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { vi, Mock } from "vitest";
import ModalChangePassword from "@/components/ModalChangePassword";
import { createClient } from "@/lib/supabase/client";
import { showNotification } from "@/lib/helper";
import { render } from "@/setup-test";

// Mock delle funzioni necessarie
vi.mock("@/lib/helper", () => ({
  showNotification: vi.fn(),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(),
}));

describe("ModalChangePassword", () => {
  const mockOnClose = vi.fn();
  const mockRpc = vi.fn();

  beforeEach(() => {
    // Configurazione del mock per createClient
    (createClient as Mock).mockReturnValue({
      rpc: mockRpc,
    });
    vi.clearAllMocks();
  });

  it("dovrebbe aprire il modal e resettare il form", () => {
    const { getByLabelText } = render(
      <ModalChangePassword isOpen={true} onClose={mockOnClose} />
    );

    expect(getByLabelText("Vecchia password")).toBeInTheDocument();
    expect(getByLabelText("Nuova password")).toBeInTheDocument();
    expect(getByLabelText("Ripeti password")).toBeInTheDocument();
  });

  it("dovrebbe chiudere il modal quando si clicca su Annulla", () => {
    const { getByText } = render(
      <ModalChangePassword isOpen={true} onClose={mockOnClose} />
    );

    fireEvent.click(getByText("Annulla"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("dovrebbe mostrare notifiche in caso di errore", async () => {
    mockRpc.mockResolvedValueOnce({
      error: null,
      data: { error: true, message: "Errore" },
    });

    const { getByLabelText, getByText } = render(
      <ModalChangePassword isOpen={true} onClose={mockOnClose} />
    );

    fireEvent.change(getByLabelText("Vecchia password"), {
      target: { value: "vecchiaPassword" },
    });
    fireEvent.change(getByLabelText("Nuova password"), {
      target: { value: "nuovaPassword" },
    });
    fireEvent.change(getByLabelText("Ripeti password"), {
      target: { value: "nuovaPassword" },
    });

    fireEvent.click(getByText("Salva"));

    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith({
        message: "Errore",
      });
    });
  });

  it("dovrebbe mostrare una notifica di successo quando la password è cambiata", async () => {
    mockRpc.mockResolvedValueOnce({ error: null, data: { error: false } });

    const { getByLabelText, getByText } = render(
      <ModalChangePassword isOpen={true} onClose={mockOnClose} />
    );

    fireEvent.change(getByLabelText("Vecchia password"), {
      target: { value: "vecchiaPassword" },
    });
    fireEvent.change(getByLabelText("Nuova password"), {
      target: { value: "nuovaPassword" },
    });
    fireEvent.change(getByLabelText("Ripeti password"), {
      target: { value: "nuovaPassword" },
    });

    fireEvent.click(getByText("Salva"));

    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith({
        message: "Password cambiata con successo",
        success: true,
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("dovrebbe mostrare errori di validazione quando il form è inviato con input vuoti", async () => {
    const { getByText } = render(
      <ModalChangePassword isOpen={true} onClose={mockOnClose} />
    );

    fireEvent.click(getByText("Salva"));

    await waitFor(() => {
      expect(getByText("Inserisci la vecchia password")).toBeInTheDocument();
      expect(getByText("Inserisci la nuova password")).toBeInTheDocument();
      expect(
        getByText("Inserisci il valore della nuova password")
      ).toBeInTheDocument();
    });
  });

  it("dovrebbe mostrare errori di validazione per password non corrispondenti", async () => {
    const { getByLabelText, getByText } = render(
      <ModalChangePassword isOpen={true} onClose={mockOnClose} />
    );

    fireEvent.change(getByLabelText("Vecchia password"), {
      target: { value: "vecchiaPassword" },
    });
    fireEvent.change(getByLabelText("Nuova password"), {
      target: { value: "nuovaPassword" },
    });
    fireEvent.change(getByLabelText("Ripeti password"), {
      target: { value: "diversaPassword" },
    });

    fireEvent.click(getByText("Salva"));

    await waitFor(() => {
      expect(getByText("Le due password non coincidono")).toBeInTheDocument();
    });
  });
});
