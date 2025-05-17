import { screen, fireEvent, waitFor, within, findByTestId } from "@testing-library/react";
import { apiFetch } from "@/lib/apiFetch";
import { Mock, vi } from "vitest";
import PromemoriaPage from "@/app/app/promemoria/page";
import { render } from "@/setup-test";
import { error } from "console";
import { debug } from "vitest-preview";

// Mock delle dipendenze
vi.mock("@/lib/apiFetch");

describe("PromemoriaPage", () => {
  const today = new Date();
  const data = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4);
  data.setFullYear(today.getFullYear());
  data.setMonth(today.getMonth());

  const promemoriaMock = [
    {
      id: 1,
      data: new Date(data),
      ora: new Date(0, 0, 0, 10, 30, 0),
      descrizione: "Promemoria 1",
    },
    {
      id: 2,
      data: new Date(data),
      ora: new Date(0, 0, 0, 10, 30, 0),
      descrizione: "Promemoria 2",
    },
  ];

  it('dovrebbe visualizzare il pulsante "Aggiungi"', () => {
    render(<PromemoriaPage />);

    const button = screen.getByTestId("ButtonAggiungi");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Aggiungi");
  });

  it('dovrebbe aprire il modal quando si clicca su "Aggiungi"', async () => {
    (apiFetch.get as Mock).mockResolvedValue({ data: promemoriaMock, error: false });
    render(<PromemoriaPage />);

    const button = screen.getByTestId("ButtonAggiungi");
    fireEvent.click(button);

    const modal = await screen.findByText("Aggiungi Promemoria");
    expect(modal).toBeInTheDocument();
  });

  it("dovrebbe visualizzare correttamente i promemoria per il giorno selezionato", async () => {
    (apiFetch.get as Mock).mockResolvedValue({ data: promemoriaMock, error: false });

    render(<PromemoriaPage />);

    const giorno = screen.getAllByText(data.getDate().toString());
    if (giorno.length > 1) {
      fireEvent.click(giorno[1]);
    } else {
      fireEvent.click(giorno[0]);
    }

    await waitFor(() => {
      const promemoriaElement = screen.getByText("Promemoria 1");
      expect(promemoriaElement).toBeInTheDocument();
    });
  });

  it('dovrebbe aprire il modal di cancellazione quando si clicca su "Elimina"', async () => {
    (apiFetch.get as Mock).mockResolvedValue({ data: [promemoriaMock[0]], error: false });

    render(<PromemoriaPage />);

    const giorno = screen.getAllByText(data.getDate().toString());
    if (giorno.length > 1) {
      fireEvent.click(giorno[1]);
    } else {
      fireEvent.click(giorno[0]);
    }

    await screen.findByText("Promemoria 1");

    const menu = screen.getByTestId("MenuButton");
    fireEvent.click(menu);

    const btnElimina = await screen.findByTestId("EliminaButton");
    fireEvent.click(btnElimina);

    const modalCancellazione = await screen.findByTestId("ModalCancellazione");
    expect(modalCancellazione).toBeInTheDocument();
  });

  it("dovrebbe cancellare il promemoria quando si conferma l'eliminazione", async () => {
    (apiFetch.get as Mock).mockResolvedValue({ data: [promemoriaMock[0]], error: false });
    (apiFetch.delete as Mock).mockResolvedValue({ data: promemoriaMock[0], error: false });

    render(<PromemoriaPage />);

    const giorno = screen.getAllByText(data.getDate().toString());
    if (giorno.length > 1) {
      fireEvent.click(giorno[1]);
    } else {
      fireEvent.click(giorno[0]);
    }

    await screen.findByText("Promemoria 1");

    const menu = screen.getByTestId("MenuButton");
    fireEvent.click(menu);

    const btnElimina = await screen.findByTestId("EliminaButton");
    fireEvent.click(btnElimina);

    const modalCancellazione = await screen.findByTestId("ModalCancellazione");

    const btnConfermaEliminazione = within(modalCancellazione).getByText("Elimina");
    fireEvent.click(btnConfermaEliminazione);

    const successMessage = await screen.findByText("Promemoria cancellato correttamente");
    expect(successMessage).toBeInTheDocument();
  });

  it("dovrebbe aggiungere un nuovo promemoria quando si invia il form", async () => {
    (apiFetch.get as Mock).mockResolvedValue({ data: [promemoriaMock[0]], error: false });
    (apiFetch.post as Mock).mockResolvedValue({ data: {}, error: false });

    render(<PromemoriaPage />);

    // Simula l'aggiunta di un nuovo promemoria
    const button = screen.getByTestId("ButtonAggiungi");
    fireEvent.click(button);

    await screen.findByText("Aggiungi Promemoria");

    // Compila e invia il form
    const descrizioneInput = screen.getByLabelText("Descrizione");
    const titoloInput = screen.getByLabelText("Titolo");
    const dataInput = screen.getByLabelText("Data e Ora");
    fireEvent.change(titoloInput, { target: { value: "Nuovo promemoria" } });
    fireEvent.change(descrizioneInput, { target: { value: "descrizione promemoria" } });

    fireEvent.click(dataInput);

    await waitFor(() => {
      expect(screen.queryAllByRole("dialog")).toHaveLength(2);
    });

    const dialogs = await screen.findAllByRole("dialog");

    const dialogWithText13 = dialogs.find((dialog) => {
      return within(dialog).queryByText("13");
    });

    expect(dialogWithText13).toBeInTheDocument();

    const casella = within(dialogWithText13!).getByText("13");
    fireEvent.click(casella);

    const submitButton = screen.getByText("Salva");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(apiFetch.post).toHaveBeenCalled();
    });

    await waitFor(() => {
      const successMessage = screen.getByText("Promemoria inserito correttamente");
      expect(successMessage).toBeInTheDocument();
    });
  });
});
