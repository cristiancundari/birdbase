import Carrello from "@/components/gare/id/carrello/Carrello";
import { apiFetch } from "@/lib/apiFetch";
import { render } from "@/setup-test";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { mockGara } from "../Gara";

// Mock di Supabase
vi.mock("@/providers/SupabaseProvider", () => ({
  useSupabase: vi.fn(() => ({
    user: { rna: "testRNA" },
  })),
}));

// Mock di apiFetch
vi.mock("@/lib/apiFetch", () => ({
  apiFetch: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock di PayPalButton
vi.mock("@/components/PayPalButton", () => {
  return {
    default: ({ createOrder, disabled }: any) => (
      <button
        data-testid="paypal-button"
        onClick={createOrder}
        disabled={disabled}
      >
        PayPal
      </button>
    ),
  };
});

// Mock di ModalSelezionaSoggetto
vi.mock("../../../ModalSelezionaSoggetto", () => {
  return ({ isOpen, submit, annulla, soggetti, isLoading }: any) =>
    isOpen ? (
      <div>
        <button onClick={() => submit(soggetti[0])}>Submit</button>
        <button onClick={annulla}>Annulla</button>
      </div>
    ) : null;
});

describe("Carrello", () => {
  it("dovrebbe renderizzare correttamente il carrello vuoto", () => {
    render(<Carrello gara={mockGara} />);

    expect(screen.getByText(/Aggiungi nel carrello/i)).toBeInTheDocument();
    expect(screen.getByTestId("button-iscrivi")).toBeInTheDocument();
    expect(screen.getByText(/0,00/)).toBeInTheDocument();
  });

  it("dovrebbe aggiungere un soggetto al carrello", async () => {
    (apiFetch.get as Mock).mockResolvedValueOnce({
      data: [{ id: "soggetto1", rna: "RNA1", numero: "987", anno: "2021" }],
      error: false,
    });

    render(<Carrello gara={mockGara} />);

    // Apri il modal per iscrivere soggetto
    fireEvent.click(screen.getByTestId("button-iscrivi"));

    await waitFor(() => {
      expect(apiFetch.get as Mock).toHaveBeenCalled();
    });

    // Seleziona il soggetto
    fireEvent.click(screen.getByText("RNA1-2021-987"));

    // Submit del soggetto
    fireEvent.click(screen.getByText("Seleziona"));

    await waitFor(() => {
      expect(screen.getByText(/RNA1/i)).toBeInTheDocument(); // Controlla se il soggetto è stato aggiunto
    });

    const prezzo = screen.getAllByText(/100,00/);
    expect(prezzo.length).toBe(2); // Controlla che il totale sia presente 2 volte (totale di riga e totale del carrello)
  });

  it("dovrebbe rimuovere un soggetto dal carrello", async () => {
    (apiFetch.get as Mock).mockResolvedValueOnce({
      data: [{ id: "soggetto1", rna: "RNA1", numero: "987", anno: "2021" }],
      error: false,
    });

    render(<Carrello gara={mockGara} />);

    // Apri il modal e aggiungi soggetto
    fireEvent.click(screen.getByTestId("button-iscrivi"));
    await waitFor(() => {
      expect(apiFetch.get as Mock).toHaveBeenCalled();
    });
    fireEvent.click(screen.getByText("RNA1-2021-987"));
    fireEvent.click(screen.getByText("Seleziona"));

    // Verifica che il soggetto sia presente
    await waitFor(() => {
      expect(screen.getByText(/RNA1/i)).toBeInTheDocument();
    });

    // Simula la rimozione del soggetto
    fireEvent.click(screen.getByTestId("rimuovi-soggetto"));

    // Verifica che il soggetto non sia più presente
    await waitFor(() => {
      expect(screen.queryByText(/RNA1/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/0,00/)).toBeInTheDocument(); // Controlla che il totale sia tornato a zero
  });

  it("dovrebbe creare un ordine PayPal", async () => {
    (apiFetch.get as Mock).mockResolvedValueOnce({
      data: [{ id: "soggetto1", rna: "RNA1", numero: "987", anno: "2021" }],
      error: false,
    });

    (apiFetch.post as Mock).mockResolvedValueOnce({
      data: { id: "orderId" },
      error: false,
    });

    render(<Carrello gara={mockGara} />);

    // Apri il modal e aggiungi soggetto
    fireEvent.click(screen.getByTestId("button-iscrivi"));
    await waitFor(() => {
      expect(apiFetch.get as Mock).toHaveBeenCalled();
    });
    fireEvent.click(screen.getByText("RNA1-2021-987"));
    fireEvent.click(screen.getByText("Seleziona"));

    // Simula la creazione dell'ordine PayPal
    fireEvent.click(screen.getByTestId("paypal-button"));

    await waitFor(() => {
      expect(apiFetch.post).toHaveBeenCalledWith(
        "/api/paypal/iscrizioni/createorder",
        expect.any(Object)
      );
    });
  });
});
