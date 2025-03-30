import RegistrazioniAdminPage from "@/app/admin/registrazioni/page";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import { render } from "@/setup-test";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { expect, Mock, vi } from "vitest";
import { debug } from "vitest-preview";

vi.mock("@/lib/apiFetch", () => ({
  apiFetch: {
    get: vi.fn(),
  },
}));

vi.mock("@/lib/helper", () => ({
  showNotification: vi.fn(),
  formatDataOra: vi.fn((date) => date),
  getBucketImgPath: vi.fn((a1, a2) => ""),
}));

describe("RegistrazioniAdminPage", () => {
  const mockData = {
    richiesteRegistrazione: [
      {
        id: "1",
        nome: "Mario",
        cognome: "Rossi",
        rna: "RNA123",
        email: "mario.rossi@example.com",
        createdAt: "2023-03-01T10:00:00Z",
        stato: "pending",
      },
    ],
    count: 1,
  };

  beforeEach(() => {
    (apiFetch.get as Mock).mockResolvedValue({ data: mockData, error: false });
  });

  it("dovrebbe renderizzare correttamente la pagina con dati di registrazione", async () => {
    render(<RegistrazioniAdminPage />);

    expect(screen.getByText("Richieste di registrazione")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Mario")).toBeInTheDocument();
      expect(screen.getByText("Rossi")).toBeInTheDocument();
      expect(screen.getByText("RNA123")).toBeInTheDocument();
      expect(screen.getByText("mario.rossi@example.com")).toBeInTheDocument();
    });
  });

  it("dovrebbe gestire correttamente lo stato di caricamento", async () => {
    (apiFetch.get as Mock).mockResolvedValueOnce({ message: "errore", error: true });

    render(<RegistrazioniAdminPage />);

    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith({
        message: "Si è verificato un errore durante il caricamento degli utenti",
      });
    });
  });

  it("dovrebbe aprire il modal quando si clicca sul bottone 'Esamina'", async () => {
    render(<RegistrazioniAdminPage />);

    expect(screen.getByText("Richieste di registrazione")).toBeInTheDocument();

    let btnEsamina;

    await waitFor(() => {
      expect(screen.getByText("Mario")).toBeInTheDocument();
      btnEsamina = screen.getByTestId("btnEsamina");
      fireEvent.click(btnEsamina);
    });
    await waitFor(() => {
      expect(screen.getByText("Documenti inviati")).toBeInTheDocument();
    });
  });
});
