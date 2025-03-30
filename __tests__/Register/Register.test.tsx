// Register.test.jsx
import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { apiFetch } from "@/lib/apiFetch";
import { render } from "@/setup-test";
import Register from "@/components/register/Register";
import { useRouter, usePathname } from "next/navigation";
import { debug } from "vitest-preview";
import RegisterPage from "@/app/auth/register/page";

vi.mock("@/lib/apiFetch"); // Mock della libreria apiFetch

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

describe("Pagina Register", () => {
  it("dovrebbe renderizzare la pagina", () => {
    render(<RegisterPage />);
    expect(screen.getAllByText("Registrati")).toHaveLength(2);
  });
});

describe("Componente Register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("dovrebbe mostrare i campi del modulo", () => {
    render(<Register />);
    expect(screen.getByLabelText("Nome", { selector: "input" })).toBeInTheDocument();
    expect(screen.getByLabelText(/cognome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rna/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("dovrebbe visualizzare messaggi di errore per input non validi", async () => {
    render(<Register />);

    fireEvent.click(screen.getByRole("button", { name: /registrati/i }));

    expect(await screen.findByText(/inserisci nome/i)).toBeInTheDocument();
    expect(await screen.findByText(/inserisci cognome/i)).toBeInTheDocument();
    expect(await screen.findByText(/inserisci rna/i)).toBeInTheDocument();
    expect(await screen.findByText(/inserisci email/i)).toBeInTheDocument();
  });

  /*it("dovrebbe gestire il caricamento dei file e l'invio del modulo", async () => {
    const mockPostFormData = vi.fn().mockResolvedValue({ error: false });
    apiFetch.postFormData = mockPostFormData;

    render(<Register />);

    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "Mario" },
    });
    fireEvent.change(screen.getByLabelText(/cognome/i), {
      target: { value: "Rossi" },
    });
    fireEvent.change(screen.getByLabelText(/rna/i), {
      target: { value: "00XX" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "mariorossi@mail.com" },
    });

    // Simuliamo il caricamento dei file
    const documentoIdentitaInput = screen.getByLabelText(
      /documento di identità/i
    );
    const documentoIscrizioneInput = screen.getByLabelText(
      /documento iscrizione foi/i
    );

    fireEvent.change(documentoIdentitaInput, {
      target: {
        files: [
          new File(["dummy content"], "documentoIdentita.jpg", {
            type: "image/jpeg",
          }),
        ],
      },
    });

    fireEvent.change(documentoIscrizioneInput, {
      target: {
        files: [
          new File(["dummy content"], "documentoIscrizione.jpg", {
            type: "image/jpeg",
          }),
        ],
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /registrati/i }));

    await waitFor(() => {
      expect(mockPostFormData).toHaveBeenCalledTimes(1);
    });
  });*/

  /*it("dovrebbe visualizzare un errore quando la chiamata API fallisce", async () => {
    const mockPostFormData = vi.fn().mockResolvedValue({
      error: true,
      message: "Errore durante la registrazione",
    });
    apiFetch.postFormData = mockPostFormData;

    render(<Register />);

    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "Mario" },
    });
    fireEvent.change(screen.getByLabelText(/cognome/i), {
      target: { value: "Rossi" },
    });
    fireEvent.change(screen.getByLabelText(/rna/i), {
      target: { value: "00XX" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "mariorossi@mail.com" },
    });

    const documentoIdentitaInput = screen.getByLabelText(
      /documento di identità/i
    );
    const documentoIscrizioneInput = screen.getByLabelText(
      /documento iscrizione foi/i
    );

    fireEvent.change(documentoIdentitaInput, {
      target: {
        files: [
          new File(["dummy content"], "documentoIdentita.jpg", {
            type: "image/jpeg",
          }),
        ],
      },
    });

    fireEvent.change(documentoIscrizioneInput, {
      target: {
        files: [
          new File(["dummy content"], "documentoIscrizione.jpg", {
            type: "image/jpeg",
          }),
        ],
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /registrati/i }));

    expect(
      await screen.findByText(/si è verificato un errore/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/errore durante la registrazione/i)
    ).toBeInTheDocument();
  });*/
});
