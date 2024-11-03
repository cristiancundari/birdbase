// NessunaGara.test.jsx
import { screen } from "@testing-library/react";
import { Role } from "@prisma/client";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import NessunaGara from "@/components/gare/NessunaGara";
import { render } from "@/setup-test";
import { useSupabase } from "@/providers/SupabaseProvider";

// Mock del contesto di Supabase
vi.mock("@/providers/SupabaseProvider", () => ({
  useSupabase: vi.fn(),
}));

describe("NessunaGara", () => {
  beforeEach(() => {
    // Resetta il mock prima di ogni test
    vi.clearAllMocks();
  });

  it("visualizza il messaggio di default", () => {
    // Mocking un utente non autenticato
    (useSupabase as Mock).mockReturnValue({ user: null });

    render(<NessunaGara />);

    const messaggioDefault = screen.getByText("Nessuna gara trovata.");
    expect(messaggioDefault).toBeInTheDocument();
    expect(
      screen.queryByText(
        "Inizia creando un nuova gara utilizzando il pulsante Aggiungi in alto"
      )
    ).not.toBeInTheDocument();
  });

  it("visualizza il messaggio per l'admin quando l'utente è admin", () => {
    // Mocking un utente con ruolo ADMIN
    (useSupabase as Mock).mockReturnValue({ user: { ruolo: Role.ADMIN } });

    render(<NessunaGara />);

    const messaggioAdmin = screen.getByText(
      "Inizia creando un nuova gara utilizzando il pulsante Aggiungi in alto"
    );
    expect(messaggioAdmin).toBeInTheDocument();
  });

  it("non visualizza il messaggio per l'admin per utenti non-admin", () => {
    // Mocking un utente con ruolo USER
    (useSupabase as Mock).mockReturnValue({ user: { ruolo: Role.USER } });

    render(<NessunaGara />);

    expect(
      screen.queryByText(
        "Inizia creando un nuova gara utilizzando il pulsante Aggiungi in alto"
      )
    ).not.toBeInTheDocument();
  });
});
