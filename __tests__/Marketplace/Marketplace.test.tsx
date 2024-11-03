import Marketplace from "@/components/marketplace/Marketplace";
import { apiFetch } from "@/lib/apiFetch";
import { formatAnelletto, showNotification } from "@/lib/helper";
import { useSupabase } from "@/providers/SupabaseProvider";
import { render } from "@/setup-test";
import { InserzioneWithSoggettoAndAllevatoreAndRisultatiGare } from "@/types/types";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { Mock, vi } from "vitest";
import { soggetti } from "../Soggetti/Soggetti";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/lib/apiFetch", () => ({
  apiFetch: {
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
  },
}));

vi.mock("@/providers/SupabaseProvider", () => ({
  useSupabase: vi.fn(),
}));

vi.mock("@/lib/helper", async () => ({
  ...(await vi.importActual("@/lib/helper")),
  showNotification: vi.fn(),
  initialOptions: {},
}));

const mockUser = {
  id: "profilo-1",
  allevatore: { nome: "Mario", cognome: "Rossi" },
};

const mockInserzioni: InserzioneWithSoggettoAndAllevatoreAndRisultatiGare[] = [
  {
    id: 1,
    createdAt: new Date(),
    profiloId: "profilo-1",
    soggettoId: "soggetto-1",
    soggettoCopiaId: null,
    descrizione: "Descrizione di prova",
    prezzo: 100,
    soggetto: {
      ...soggetti[0],
      iscrizioni: [
        {
          gara: {
            titolo: "Gara di prova",
            data: new Date(),
          },
          posizione: 1,
        },
      ],
    },
    profilo: {
      allevatore: {
        rna: "RNA123456",
        nome: "Nome allevatore",
        cognome: "Cognome allevatore",
      },
    },
  },
];

describe("Componente Marketplace", () => {
  let router: { refresh: Mock };

  beforeEach(() => {
    (useSupabase as Mock).mockReturnValue({
      user: mockUser,
      client: {
        auth: {
          signOut: vi.fn(),
        },
      },
    });
    router = {
      refresh: vi.fn(),
    };
    (useRouter as Mock).mockReturnValue(router);
  });

  it("dovrebbe renderizzare correttamente il componente con le inserzioni", () => {
    render(<Marketplace inserzioni={mockInserzioni} />);

    expect(screen.getByText(/aggiungi/i)).toBeInTheDocument();
    expect(screen.getByText(/descrizione di prova/i)).toBeInTheDocument();
  });

  it("dovrebbe mostrare un messaggio quando non ci sono inserzioni", () => {
    render(<Marketplace inserzioni={[]} />);

    expect(screen.getByText(/nessuna inserzione/i)).toBeInTheDocument();
  });

  it("dovrebbe aprire il modal per aggiungere una nuova inserzione", () => {
    (apiFetch.get as Mock).mockReturnValue({
      error: false,
      data: soggetti,
    });
    render(<Marketplace inserzioni={mockInserzioni} />);

    fireEvent.click(screen.getByTestId("ButtonAggiungi"));

    expect(screen.getByLabelText(/soggetto/i)).toBeInTheDocument();
  });

  it("dovrebbe aggiungere una nuova inserzione e mostrare una notifica", async () => {
    (apiFetch.get as Mock).mockReturnValue({
      error: false,
      data: soggetti,
    });
    (apiFetch.post as Mock).mockResolvedValueOnce({ error: false });

    render(<Marketplace inserzioni={[]} />);

    fireEvent.click(screen.getByTestId("ButtonAggiungi"));

    await waitFor(() => {
      expect(screen.getByText(/inserisci inserzione/i)).toBeInTheDocument();
      expect(apiFetch.get).toHaveBeenCalled();
    });

    // Simula l'inserimento di dati nel modal
    fireEvent.click(
      screen.getByText(
        formatAnelletto(soggetti[0].rna, soggetti[0].numero, soggetti[0].anno)
      )
    );
    fireEvent.change(screen.getByLabelText(/descrizione/i), {
      target: { value: "Descrizione inserzione" },
    });
    fireEvent.click(screen.getByTestId("modal-conferma-button"));

    await waitFor(() => {
      expect(apiFetch.post).toHaveBeenCalledWith(
        "/api/inserzioni",
        expect.any(Object)
      );
      expect(showNotification).toHaveBeenCalledWith({
        message: "Inserzione aggiunta correttamente!",
        success: true,
      });
      expect(router.refresh).toHaveBeenCalled();
    });
  });

  it("dovrebbe modificare un'inserzione e mostrare una notifica", async () => {
    (apiFetch.get as Mock).mockReturnValue({
      error: false,
      data: soggetti,
    });
    (apiFetch.patch as Mock).mockReturnValue({
      error: false,
      data: {},
    });

    render(<Marketplace inserzioni={mockInserzioni} />);

    expect(screen.getByText(/Descrizione di prova/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("inserzione-item-menu"));
    await waitFor(() => {
      fireEvent.click(screen.getByText(/modifica/i));
    });
    await waitFor(() => {
      expect(screen.getByText(/modifica inserzione/i)).toBeInTheDocument();
      expect(apiFetch.get).toHaveBeenCalled();
    });

    fireEvent.change(screen.getByLabelText(/descrizione/i), {
      target: { value: "Inserzione Modificata" },
    });
    fireEvent.click(screen.getByTestId("modal-conferma-button"));

    await waitFor(() => {
      expect(apiFetch.patch).toHaveBeenCalledWith(
        "/api/inserzioni/1",
        expect.any(Object)
      );
      expect(showNotification).toHaveBeenCalledWith({
        message: "Inserzione modificata correttamente!",
        success: true,
      });
      expect(router.refresh).toHaveBeenCalled();
    });
  });

  it("dovrebbe eliminare un'inserzione e mostrare una notifica", async () => {
    (apiFetch.get as Mock).mockReturnValue({
      error: false,
      data: soggetti,
    });
    (apiFetch.delete as Mock).mockReturnValue({
      error: false,
      data: {},
    });

    render(<Marketplace inserzioni={mockInserzioni} />);

    expect(screen.getByText(/Descrizione di prova/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("inserzione-item-menu"));

    await waitFor(() => {
      fireEvent.click(screen.getByText(/elimina/i));
    });

    await waitFor(() => {
      expect(screen.getByText(/elimina inserzione/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("modal-conferma-button"));

    await waitFor(() => {
      expect(apiFetch.delete).toHaveBeenCalledWith("/api/inserzioni/1");
      expect(showNotification).toHaveBeenCalledWith({
        message: "Inserzione eliminata con successo",
        success: true,
      });
      expect(router.refresh).toHaveBeenCalled();
    });
  });
});
