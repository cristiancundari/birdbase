import InfoCovata from "@/components/covate/id/infoCovata";
import { render } from "@/setup-test";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, Mock, Mocked, test, vi } from "vitest";
import { covate } from "./Covate";
import { soggetti } from "../Soggetti/Soggetti";
import * as functions from "@/components/home/functions";
import { formatAnelletto } from "@/lib/helper";
import { apiFetch } from "@/lib/apiFetch";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/components/home/functions", () => ({
  aggiungiSoggetto: vi.fn(),
  modificaSoggetto: vi.fn(),
  togglePreferitoSoggetto: vi.fn(),
}));

vi.mock("@/lib/apiFetch", () => ({
  apiFetch: {
    patchFormData: vi.fn().mockResolvedValue({ error: false }),
  },
}));

const mockRouter = {
  refresh: vi.fn(),
};

beforeEach(() => {
  (useRouter as Mock).mockReturnValue(mockRouter);
});

const mockCovata = {
  ...covate[0],
  figli: [soggetti[0], soggetti[1]],
};

describe("InfoCovata", () => {
  test("renderizza il componente con i dati iniziali", () => {
    render(<InfoCovata covata={mockCovata} />);

    expect(screen.getByText("Figli")).toBeInTheDocument();
    expect(
      screen.getByText(
        formatAnelletto(soggetti[0].rna, soggetti[0].numero, soggetti[0].anno)
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        formatAnelletto(soggetti[1].rna, soggetti[1].numero, soggetti[1].anno)
      )
    ).toBeInTheDocument();
  });

  test("apre il modulo per aggiungere un nuovo soggetto", async () => {
    render(<InfoCovata covata={mockCovata} />);

    fireEvent.click(screen.getByTestId("button-aggiungi-figlio"));

    await waitFor(() => {
      expect(screen.getByText("Crea nuovo")).toBeInTheDocument();
    });
  });

  test("invia il modulo per aggiungere un soggetto", async () => {
    const { aggiungiSoggetto } = functions as Mocked<typeof functions>;
    aggiungiSoggetto.mockResolvedValue({ error: false, data: {} });

    render(<InfoCovata covata={mockCovata} />);

    fireEvent.click(screen.getByTestId("button-aggiungi-figlio"));
    await waitFor(() => {
      fireEvent.click(screen.getByText("Crea nuovo"));
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/rna/i)).toBeInTheDocument();
    });

    // Simula l'inserimento dei dati nel modal
    fireEvent.change(screen.getByLabelText(/rna/i), {
      target: { value: "RNA" },
    });
    fireEvent.change(screen.getByLabelText(/numero/i), {
      target: { value: "888" },
    });
    fireEvent.change(screen.getByLabelText(/anno/i), {
      target: { value: "2024" },
    });
    fireEvent.click(screen.getByTestId("ButtonSalva"));

    await waitFor(() => {
      expect(aggiungiSoggetto).toHaveBeenCalled();
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  test("rimuove un soggetto quando confermato", async () => {
    const covataTest = {
      ...mockCovata,
      figli: [soggetti[0]],
    };
    render(<InfoCovata covata={covataTest} />);

    // Simula il clic sul menu per aprire le opzioni
    fireEvent.click(screen.getByTestId("MenuButton"));
    await waitFor(() => {
      // Simula il clic sull'opzione "Rimuovi" per aprire il modal di conferma
      fireEvent.click(screen.getByText("Rimuovi"));
    });
    await waitFor(() => {
      // Conferma la rimozione cliccando il pulsante di conferma del modal
      fireEvent.click(screen.getByTestId("modal-conferma-button"));
    });

    await waitFor(() => {
      expect(apiFetch.patchFormData).toHaveBeenCalledWith(
        `/api/soggetti/${mockCovata.figli[0].id}`,
        expect.any(FormData)
      );
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });
});
