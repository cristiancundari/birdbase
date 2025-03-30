import AllevatoriAdminPage from "@/app/admin/allevatori/page";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import { render } from "@/setup-test";
import { Role } from "@prisma/client";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, Mock, vi } from "vitest";

vi.mock("@/lib/apiFetch", () => ({
  apiFetch: {
    get: vi.fn(),
  },
}));

vi.mock("@/lib/helper", () => ({
  showNotification: vi.fn(),
}));

describe("AllevatoriAdminPage", () => {
  beforeEach(() => {
    const mockData = {
      users: [
        {
          id: "1",
          allevatore: {
            nome: "Mario",
            cognome: "Rossi",
            rna: "RNA123",
          },
          ruolo: Role.USER,
        },
        {
          id: "2",
          allevatore: {
            nome: "Luigi",
            cognome: "Verdi",
            rna: "RNA456",
          },
          ruolo: Role.ADMIN,
        },
      ],
      pagination: {
        total: 2,
        page: 1,
        pageSize: 25,
      },
    };

    (apiFetch.get as Mock).mockResolvedValue({ data: mockData, error: false });
  });

  it("dovrebbe renderizzare correttamente la pagina con i dati degli allevatori", async () => {
    render(<AllevatoriAdminPage />);

    await waitFor(() => {
      expect(screen.getByText("Mario")).toBeInTheDocument();
      expect(screen.getByText("Rossi")).toBeInTheDocument();
      expect(screen.getByText("RNA123")).toBeInTheDocument();
      expect(screen.getByText(Role.USER)).toBeInTheDocument();
    });
  });

  it("gestisce correttamente gli errori nella chiamata API", async () => {
    (apiFetch.get as Mock).mockResolvedValueOnce({ error: true });

    render(<AllevatoriAdminPage />);

    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith({
        message: "Si è verificato un errore durante il caricamento degli utenti",
      });
    });
  });
});
