import { screen, fireEvent, waitFor } from "@testing-library/react";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import { RichiestaRegistrazione } from "@prisma/client";
import { Mock, vi } from "vitest";
import { render } from "@/setup-test";
import RegistrazioneAdminModal from "@/components/admin/registrazioni/registrazioneModal";

// Mock delle dipendenze esterne
vi.mock("@/lib/apiFetch");
vi.mock("@/lib/helper", async () => ({
  ...(await vi.importActual("@/lib/helper")),
  showNotification: vi.fn(),
}));

const mockRichiestaRegistrazione: RichiestaRegistrazione = {
  id: 5,
  createdAt: new Date(),
  nome: "Mario",
  cognome: "Rossi",
  email: "mariorossi@mail.com",
  rna: "RNA123",
  docIdentita: "doc_identita.jpg",
  docFoi: "doc_foi.jpg",
  spiegazione: null,
  approvatoIl: null,
  rifiutatoIl: null,
};

describe("RegistrazioneAdminModal", () => {
  let onClose: Mock;
  let onResult: Mock;

  beforeEach(() => {
    onClose = vi.fn();
    onResult = vi.fn();
  });

  test("dovrebbe renderizzare il modal con i documenti", () => {
    render(
      <RegistrazioneAdminModal
        isOpen={true}
        onClose={onClose}
        onResult={onResult}
        richiestaRegistrazione={mockRichiestaRegistrazione}
      />
    );

    expect(screen.getByText("Documenti inviati")).toBeInTheDocument();
    expect(screen.getByAltText("Doc. Identità")).toBeInTheDocument();
    expect(screen.getByAltText("Doc. FOI")).toBeInTheDocument();
  });

  test("dovrebbe mostrare il campo di descrizione e i pulsanti di approvazione e rifiuto", () => {
    render(
      <RegistrazioneAdminModal
        isOpen={true}
        onClose={onClose}
        onResult={onResult}
        richiestaRegistrazione={mockRichiestaRegistrazione}
      />
    );

    expect(screen.getByLabelText("Descrizione")).toBeInTheDocument();
    expect(screen.getByText("Rifiuta")).toBeInTheDocument();
    expect(screen.getByText("Approva")).toBeInTheDocument();
  });

  test("dovrebbe approvare una richiesta e mostrare una notifica", async () => {
    (apiFetch.post as Mock).mockResolvedValue({ error: false });

    render(
      <RegistrazioneAdminModal
        isOpen={true}
        onClose={onClose}
        onResult={onResult}
        richiestaRegistrazione={mockRichiestaRegistrazione}
      />
    );

    fireEvent.change(screen.getByLabelText("Descrizione"), {
      target: { value: "Approvato, iscrizione conforme" },
    });

    fireEvent.click(screen.getByText("Approva"));

    await waitFor(() => {
      expect(apiFetch.post).toHaveBeenCalledWith(
        `/admin/api/registrazioni/${mockRichiestaRegistrazione.id}`,
        { status: "approved", spiegazione: "Approvato, iscrizione conforme" }
      );
      expect(showNotification).toHaveBeenCalledWith({
        message: "La richiesta è stata approvata correttamente",
        success: true,
      });
      expect(onResult).toHaveBeenCalledWith("approved");
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("dovrebbe rifiutare una richiesta e mostrare una notifica", async () => {
    (apiFetch.post as Mock).mockResolvedValue({ error: false });

    render(
      <RegistrazioneAdminModal
        isOpen={true}
        onClose={onClose}
        onResult={onResult}
        richiestaRegistrazione={mockRichiestaRegistrazione}
      />
    );

    fireEvent.change(screen.getByLabelText("Descrizione"), {
      target: { value: "Rifiutato per documento non leggibile" },
    });

    fireEvent.click(screen.getByText("Rifiuta"));

    await waitFor(() => {
      expect(apiFetch.post).toHaveBeenCalledWith(
        `/admin/api/registrazioni/${mockRichiestaRegistrazione.id}`,
        {
          status: "rejected",
          spiegazione: "Rifiutato per documento non leggibile",
        }
      );
      expect(showNotification).toHaveBeenCalledWith({
        message: "La richiesta è stata rifiutata correttamente",
        success: true,
      });
      expect(onResult).toHaveBeenCalledWith("rejected");
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("dovrebbe mostrare una notifica di errore in caso di approvazione fallita", async () => {
    (apiFetch.post as Mock).mockResolvedValue({
      error: true,
      message: "Errore",
    });

    render(
      <RegistrazioneAdminModal
        isOpen={true}
        onClose={onClose}
        onResult={onResult}
        richiestaRegistrazione={mockRichiestaRegistrazione}
      />
    );

    fireEvent.click(screen.getByText("Approva"));

    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith({ message: "Errore" });
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("dovrebbe mostrare una notifica di errore in caso di rifiuto fallito", async () => {
    (apiFetch.post as Mock).mockResolvedValue({
      error: true,
      message: "Errore",
    });

    render(
      <RegistrazioneAdminModal
        isOpen={true}
        onClose={onClose}
        onResult={onResult}
        richiestaRegistrazione={mockRichiestaRegistrazione}
      />
    );

    fireEvent.click(screen.getByText("Rifiuta"));

    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith({ message: "Errore" });
      expect(onClose).toHaveBeenCalled();
    });
  });
});
