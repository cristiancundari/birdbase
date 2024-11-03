import { screen, fireEvent } from "@testing-library/react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Role } from "@prisma/client";
import { Mock, vi } from "vitest";
import IscrizioneItem from "@/components/gare/id/iscrizioni/IscrizioneItem";
import { render } from "@/setup-test";
import { soggetti } from "@/__tests__/Soggetti/Soggetti";
import { IscrizioneWithSoggettoAndProfiloWithAllevatore } from "@/types/types";
import { debug } from "vitest-preview";

// Mock del provider di Supabase
vi.mock("@/providers/SupabaseProvider", () => ({
  useSupabase: vi.fn(),
}));

describe("IscrizioneItem", () => {
  const mockIscrizione: IscrizioneWithSoggettoAndProfiloWithAllevatore = {
    id: "iscrizione-1",
    garaId: "gara-1",
    importo: 100,
    createdAt: new Date(),
    soggettoId: soggetti[0].id,
    soggetto: {
      ...soggetti[0],
      rna: "RNA123",
      numero: "987",
      anno: "2023",
    },
    profiloId: "profilo-1",
    profilo: {
      id: "profilo-1",
      budget: 100,
      googleRefreshToken: "token",
      rna: "RNA123",
      ruolo: "USER",
      allevatore: {
        rna: "RNA123",
        nome: "Mario",
        cognome: "Rossi",
      },
    },
    voto: 10,
    posizione: 1,
  };

  beforeEach(() => {
    // Mocking useSupabase to return a non-admin user
    (useSupabase as Mock).mockReturnValue({
      user: { ruolo: Role.USER },
    });
  });

  test("dovrebbe mostrare i dettagli del soggetto e dell'allevatore", () => {
    render(<IscrizioneItem iscrizione={mockIscrizione} />);

    expect(screen.getByText("RNA123-2023-987")).toBeInTheDocument();
    expect(screen.getByText("Mario Rossi")).toBeInTheDocument();
  });

  test("dovrebbe mostrare il voto e la posizione se la gara è completata", () => {
    render(
      <IscrizioneItem iscrizione={mockIscrizione} garaStatus="COMPLETATA" />
    );

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("🥇")).toBeInTheDocument();
  });

  test("dovrebbe nascondere il voto e la posizione se la gara non è completata", () => {
    render(
      <IscrizioneItem iscrizione={mockIscrizione} garaStatus="VALUTAZIONE" />
    );

    expect(screen.queryByText("10")).not.toBeInTheDocument();
    expect(screen.queryByText("🥇")).not.toBeInTheDocument();
  });

  test('dovrebbe mostrare "N.C." se la posizione è null', () => {
    const iscrizioneConPosizioneNulla = { ...mockIscrizione, posizione: null };
    render(
      <IscrizioneItem
        iscrizione={iscrizioneConPosizioneNulla}
        garaStatus="COMPLETATA"
      />
    );

    expect(screen.getByText("N.C.")).toBeInTheDocument();
  });

  test("dovrebbe mostrare, se l'utente è admin e la gara è in valutazione, un campo in cui inserire il voto", () => {
    (useSupabase as Mock).mockReturnValueOnce({
      user: { ruolo: Role.ADMIN },
    });

    render(
      <IscrizioneItem iscrizione={mockIscrizione} garaStatus="VALUTAZIONE" />
    );

    expect(screen.getByTestId("input-voto")).toBeInTheDocument();
  });

  test("dovrebbe chiamare onVotoChange quando il voto viene cambiato", () => {
    const onVotoChangeMock = vi.fn();
    (useSupabase as Mock).mockReturnValueOnce({
      user: { ruolo: Role.ADMIN },
    });

    render(
      <IscrizioneItem
        iscrizione={mockIscrizione}
        onVotoChange={onVotoChangeMock}
        garaStatus="VALUTAZIONE"
      />
    );

    const inputVoto = screen.getByTestId("input-voto");
    fireEvent.change(inputVoto, { target: { value: "80" } });

    expect(onVotoChangeMock).toHaveBeenCalledWith(mockIscrizione.id, 80);
  });
});
