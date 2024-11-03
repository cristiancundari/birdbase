import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { debug } from "vitest-preview";
import { apiFetch } from "@/lib/apiFetch";
import { useSupabase } from "@/providers/SupabaseProvider";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";
import { render } from "@/setup-test";
import InserzioneItem from "@/components/marketplace/InserzioneItem";
import { InserzioneWithSoggettoAndAllevatoreAndRisultatiGare } from "@/types/types";

// Mock del provider Supabase
vi.mock("@/providers/SupabaseProvider", () => ({
  useSupabase: vi.fn(),
}));

// Mock della funzione apiFetch
vi.mock("@/lib/apiFetch", () => ({
  apiFetch: {
    post: vi.fn(),
  },
}));

// Mock per la funzione getIconSesso
vi.mock("../IconsSesso", () => ({
  getIconSesso: vi.fn(() => <span>Sesso Icon</span>),
}));

describe("InserzioneItem", () => {
  const mockInserzione: InserzioneWithSoggettoAndAllevatoreAndRisultatiGare = {
    id: 1,
    prezzo: 100,
    descrizione: "Descrizione esempio",
    soggetto: {
      id: "soggetto-1",
      rna: "RNA123",
      numero: "001",
      anno: "2024",
      avatar: null,
      sesso: true,
      iscrizioni: [],
      profiloId: "1",
      covataId: null,
      dataNascita: new Date("2020-01-01"),
      gabbia: null,
      isMorto: false,
      note: "note test",
      preferito: true,
    },
    createdAt: new Date("2024-01-01"),
    profiloId: "user-id",
    profilo: {
      allevatore: {
        cognome: "Rossi",
        nome: "Mario",
        rna: "RNA456",
      },
    },
    soggettoCopiaId: "soggetto-1",
    soggettoId: "soggetto-1",
  };

  const onEditMock = vi.fn();
  const onDeleteMock = vi.fn();

  beforeEach(() => {
    // Resetta i mock prima di ogni test
    vi.clearAllMocks();

    // Mock per il componente PayPalButton
    vi.mock("@paypal/react-paypal-js");

    // Simula l'utente
    (useSupabase as Mock).mockReturnValue({
      user: { id: "user-id", ruolo: "UTENTE" },
    });

    // Mock per PayPalButtons
    vi.mock("@paypal/react-paypal-js", () => ({
      PayPalButtons: ({ createOrder, onApprove, disabled = false }: any) => {
        const handleClick = async () => {
          const orderId = await createOrder(); // Simula la creazione di un ordine
          // Simula l'approvazione, chiamando onApprove con un oggetto che ha orderID
          await onApprove({ orderID: orderId });
        };

        return (
          <button onClick={handleClick} disabled={disabled}>
            PayPal Button
          </button>
        );
      },
    }));
  });

  test("renderizza correttamente l'inserzione", () => {
    render(
      <InserzioneItem
        inserzione={mockInserzione}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    expect(screen.getByText("Descrizione esempio")).toBeInTheDocument();
    expect(screen.getByText(/RNA123/i)).toBeInTheDocument();
    expect(screen.getByText("100,00 €")).toBeInTheDocument();
  });

  test("chiama onEdit quando si clicca su Modifica", async () => {
    render(
      <InserzioneItem
        inserzione={mockInserzione}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    fireEvent.click(screen.getByTestId("vertical-dots-test"));
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Modifica/i));
    });

    expect(onEditMock).toHaveBeenCalledWith(mockInserzione);
  });

  test("chiama onDelete quando si clicca su Elimina", async () => {
    render(
      <InserzioneItem
        inserzione={mockInserzione}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    fireEvent.click(screen.getByTestId("vertical-dots-test"));
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Elimina/i));
    });

    expect(onDeleteMock).toHaveBeenCalledWith(mockInserzione.id);
  });

  test("cattura l'ordine correttamente", async () => {
    const nuovaInserzione = {
      ...mockInserzione,
      profiloId: "otheruser",
    };
    (apiFetch.post as Mock).mockResolvedValue({
      error: false,
      data: { id: "orderid" },
    });

    render(
      <InserzioneItem
        inserzione={nuovaInserzione}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    // Simula la creazione dell'ordine
    const createOrderButton = screen.getByText(/paypal button/i);
    fireEvent.click(createOrderButton);

    await waitFor(() =>
      expect(apiFetch.post as Mock).toHaveBeenCalledWith(
        "/api/paypal/inserzioni/createorder",
        expect.any(Object)
      )
    );
  });

  test("mostra un messaggio di errore se la cattura dell'ordine fallisce", async () => {
    const nuovaInserzione = {
      ...mockInserzione,
      profiloId: "otheruser",
    };
    (apiFetch.post as Mock).mockResolvedValueOnce({
      error: true,
      message: "Errore nella cattura",
    });

    render(
      <InserzioneItem
        inserzione={nuovaInserzione}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    const createOrderButton = screen.getByText(/paypal button/i);
    fireEvent.click(createOrderButton);

    await waitFor(() =>
      expect(screen.getByText("Errore nella cattura")).toBeInTheDocument()
    );
  });
});
