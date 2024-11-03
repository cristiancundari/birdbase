import { screen, waitFor } from "@testing-library/react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { apiFetch } from "@/lib/apiFetch";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { GaraStatus, Role } from "@prisma/client";
import InfoGara from "@/components/gare/id/InfoGara";
import { render } from "@/setup-test";
import { Single_Day } from "next/font/google";
import { debug } from "vitest-preview";

// Mock del contesto di Supabase e della funzione apiFetch
vi.mock("@/providers/SupabaseProvider", () => ({
  useSupabase: vi.fn(),
}));

vi.mock("@/lib/apiFetch", () => ({
  apiFetch: {
    get: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("InfoGara", () => {
  const mockGara = {
    id: "dkfrfhjdvb39",
    titolo: "Canarini gialli",
    data: new Date("2024-05-01T00:00:00Z"),
    tipologia: "Corsa",
    citta: "Roma",
    immagine: "https://example.com/immagine.jpg",
    nazioneId: 1,
    createdAt: new Date(),
    isDeleted: false,
    prezzo: 25.0,
    capienza: 100,
    stato: GaraStatus.PUBBLICA,
    nazione: { id: 1, nome: "Italia", sigla: "IT" },
    _count: { iscrizioni: 0 },
    iscrizioni: [],
    ordiniIscrizioni: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("visualizza il breadcrumb corretto per l'utente admin", () => {
    (useSupabase as Mock).mockReturnValue({ user: { ruolo: Role.ADMIN } });
    (apiFetch.get as Mock).mockResolvedValue({
      error: false,
      data: { iscrizioni: [] },
    });
    render(<InfoGara gara={mockGara} />);

    expect(screen.getByText("Gare")).toBeInTheDocument();
    expect(screen.getByText("Info gara")).toBeInTheDocument();
  });

  it("visualizza il messaggio corretto quando la gara è completata", async () => {
    const garaCompletata = { ...mockGara, stato: GaraStatus.COMPLETATA };
    (apiFetch.get as Mock).mockResolvedValue({
      error: false,
      data: { iscrizioni: [] },
    });
    (useSupabase as Mock).mockReturnValue({ user: null });

    render(<InfoGara gara={garaCompletata} />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "La gara è completata e non è possible iscrivere nuovi soggetti."
        )
      ).toBeInTheDocument();
    });
  });

  it("visualizza il messaggio corretto quando la gara è in attesa di valutazione", async () => {
    const garaInValutazione = { ...mockGara, stato: GaraStatus.VALUTAZIONE };
    (apiFetch.get as Mock).mockResolvedValue({
      error: false,
      data: { iscrizioni: [] },
    });
    (useSupabase as Mock).mockReturnValue({ user: null });

    render(<InfoGara gara={garaInValutazione} />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "La gara è in attesa di valutazione da parte di un amministratore. Ritorna più tardi per visualizzare i punteggi e la classifica."
        )
      ).toBeInTheDocument();
    });
  });

  it("visualizza il messaggio corretto quando non ci sono più posti disponibili", async () => {
    const garaCapienzaEsaurita = {
      ...mockGara,
      capienza: 10,
      _count: { iscrizioni: 10 },
    };
    (apiFetch.get as Mock).mockResolvedValue({
      error: false,
      data: { iscrizioni: [] },
    });
    (useSupabase as Mock).mockReturnValue({ user: null });

    render(<InfoGara gara={garaCapienzaEsaurita} />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Non ci sono più posti disponibili per cui non è possibile iscrivere alcun soggetto."
        )
      ).toBeInTheDocument();
    });
  });

  it("visualizza la sezione Iscrizioni quando la gara è aperta", async () => {
    (apiFetch.get as Mock).mockResolvedValue({
      error: false,
      data: { iscrizioni: [] },
    });
    (useSupabase as Mock).mockReturnValue({ user: null });

    render(<InfoGara gara={mockGara} />);

    await waitFor(() => {
      expect(screen.getByText("Iscrivi")).toBeInTheDocument();
    });
  });

  it("visualizza il Carrello solo per gli utenti non admin", async () => {
    (apiFetch.get as Mock).mockResolvedValue({
      error: false,
      data: { iscrizioni: [] },
    });
    (useSupabase as Mock).mockReturnValue({ user: { ruolo: Role.USER } });

    render(<InfoGara gara={mockGara} />);

    await waitFor(() => {
      expect(screen.getByTestId("carrello-test")).toBeInTheDocument();
    });
  });

  it("visualizza la sezione Incassi per gli utenti admin", async () => {
    (apiFetch.get as Mock).mockResolvedValue({
      error: false,
      data: { iscrizioni: [] },
    });
    (useSupabase as Mock).mockReturnValue({ user: { ruolo: Role.ADMIN } });

    render(<InfoGara gara={mockGara} />);

    await waitFor(() => {
      expect(screen.getByTestId("incassi-test")).toBeInTheDocument();
    });
  });
});
