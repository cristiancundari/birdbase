import { screen, waitFor } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import { cookies } from "next/headers";
import InfoSoggettoPage from "@/app/app/home/[id]/page";
import { formatAnelletto } from "@/lib/helper";
import { render } from "@/setup-test";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    soggetto: {
      findUnique: vi.fn(),
    },
  },
}));
vi.mock("@/lib/supabase/helper", () => ({
  getServerUser: vi.fn(),
}));
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("Pagina InfoSoggettoPage", () => {
  const mockUser = { id: "user-id" };
  const mockSoggetto = {
    id: "soggetto-id",
    avatar: null,
    rna: "RNA123",
    numero: "456",
    anno: "2023",
    sesso: true,
    dataNascita: "2020-01-01",
    profiloId: "user-id", // Simula che il profilo corrisponda all'utente
    iscrizioni: [
      {
        id: 400,
        voto: 90,
        posizione: 1,
        gara: {
          data: "2025-03-01",
          nazione: { nome: "Italia", sigla: "it" },
        },
      },
    ],
  };

  beforeEach(() => {
    (getServerUser as Mock).mockResolvedValue(mockUser);
    (prisma.soggetto.findUnique as Mock).mockResolvedValue(mockSoggetto);
    (cookies as Mock).mockReturnValue({});
  });

  test("dovrebbe mostrare il messaggio di errore quando il soggetto non viene trovato", async () => {
    (prisma.soggetto.findUnique as Mock).mockResolvedValueOnce(null);

    render(await InfoSoggettoPage({ params: { id: "id-errore" } }));

    expect(screen.getByText("Errore: soggetto non trovato")).toBeInTheDocument();
  });

  test("dovrebbe mostrare le informazioni del soggetto", async () => {
    render(await InfoSoggettoPage({ params: { id: mockSoggetto.id } }));

    await waitFor(() => expect(prisma.soggetto.findUnique).toHaveBeenCalled());

    // Controlla che l'avatar, il sesso e le informazioni del soggetto siano renderizzati
    expect(screen.getByTestId("ImgAvatar").querySelector("img")).toHaveAttribute(
      "src",
      expect.stringContaining(formatAnelletto("RNA123", "456", "2023"))
    );
    expect(screen.getByText(formatAnelletto("RNA123", "456", "2023"))).toBeInTheDocument();
    expect(screen.getByText("Sesso:")).toBeInTheDocument();
    expect(screen.getByText("Data di nascita: 01/01/2020")).toBeInTheDocument();
    expect(screen.getByText("1°")).toBeInTheDocument();
    expect(screen.getByText("Voto: 90/100")).toBeInTheDocument();
  });

  test("dovrebbe renderizzare l'avatar se presente", async () => {
    const soggettoConAvatar = { ...mockSoggetto, avatar: "path/to/avatar.jpg" };
    (prisma.soggetto.findUnique as Mock).mockResolvedValueOnce(soggettoConAvatar);

    render(await InfoSoggettoPage({ params: { id: soggettoConAvatar.id } }));

    await waitFor(() => expect(prisma.soggetto.findUnique).toHaveBeenCalled());

    // Verifica che l'avatar sia quello fornito
    expect(screen.getByTestId("ImgAvatar").querySelector("img")).toHaveAttribute("src", expect.stringContaining("path/to/avatar.jpg"));
  });
});
