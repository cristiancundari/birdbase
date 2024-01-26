import {
  cleanup,
  findByText,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import assert from "assert";
import { HttpResponse, http } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import server from "../ServerMock";
import Budget from "@/components/portafoglio/budget";
import { categorie, transazioni } from "./Portafoglio";
import { PortafoglioContext } from "@/components/portafoglio/portafoglioPage";
import { Profilo, Transazione } from "@prisma/client";
import Transazioni from "@/components/portafoglio/transazioni/transazioni";
import { debug } from "vitest-preview";
import exp from "constants";
import { Box } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { render } from "@/setup-test";
import { act } from "react-dom/test-utils";

describe("<Transazioni />", () => {
  const TransazioniComp = (
    <PortafoglioContext.Provider value={{ state: 0, setState: vi.fn() }}>
      <Transazioni />
    </PortafoglioContext.Provider>
  );

  it("dovrebbe visualizzare la lista delle transazioni", async () => {
    server.use(
      http.get("/api/transazioni", () => {
        return HttpResponse.json(
          { result: transazioni, error: false },
          { status: 200 }
        );
      })
    );

    render(TransazioniComp);
    const transazioniComp = await screen.findAllByTestId("TransazioneComp");
    expect(transazioniComp.length).toBe(transazioni.length);
  });

  it("dovrebbe visualizzare il modal di aggiunta transazione quando si fa click sul pulsante aggiungi", async () => {
    server.use(
      http.get("/api/transazioni", () => {
        return HttpResponse.json(
          { result: transazioni, error: false },
          { status: 200 }
        );
      })
    );

    render(TransazioniComp);
    const buttonAggiungi = screen.getByTestId("ButtonAggiungi");
    const modalAggiungi = screen.getByTestId("ModalTransazione");
    expect(modalAggiungi.hasChildNodes()).toBeFalsy();
    fireEvent.click(buttonAggiungi);
    expect(modalAggiungi.hasChildNodes()).toBeTruthy();
    const modalTitle = within(modalAggiungi).getByText("Aggiungi Transazione");
    expect(modalTitle).toBeInTheDocument();
  });

  it("dovrebbe salvare una nuova transazione", async () => {
    const newTransazione: Transazione = {
      id: 999,
      descrizione: "Test transazione",
      prezzo: 199.85,
      modificabile: true,
      categoriaId: 2,
      data: new Date(2024, 0, 15),
      createdAt: new Date(2024, 0, 15),
      profiloId: "UserProfiloId",
    };
    server.use(
      http.get("/api/transazioni", () => {
        return HttpResponse.json(
          { result: transazioni, error: false },
          { status: 200 }
        );
      }),
      http.get("/api/categorie", () => {
        return HttpResponse.json(
          { result: categorie, error: false },
          { status: 200 }
        );
      }),
      http.post("/api/transazioni", () => {
        return HttpResponse.json(
          { result: newTransazione, error: false },
          { status: 200 }
        );
      })
    );

    render(TransazioniComp);
    const buttonAggiungi = screen.getByTestId("ButtonAggiungi");
    const modalAggiungi = screen.getByTestId("ModalTransazione");
    fireEvent.click(buttonAggiungi);
    const buttonSalva = within(modalAggiungi).getByText("Salva");
    const selectCategoria = within(modalAggiungi).getByLabelText("Categoria");
    const inputDescrizione =
      within(modalAggiungi).getByLabelText("Descrizione");
    const inputData = within(modalAggiungi).getByLabelText("Data transazione");
    const inputPrezzo = within(modalAggiungi).getByLabelText("Prezzo");

    fireEvent.input(selectCategoria, {
      target: { input: newTransazione.categoriaId.toString() },
    });
    fireEvent.input(inputDescrizione, {
      target: { value: newTransazione.descrizione },
    });
    fireEvent.input(inputData, {
      target: { value: newTransazione.data.toLocaleDateString() },
    });
    fireEvent.input(inputPrezzo, {
      target: { value: newTransazione.prezzo.toString() },
    });

    const getTransazioni = vi.fn();
    server.use(http.get("/api/transazioni", getTransazioni));
    fireEvent.click(buttonSalva);

    const notification = await screen.findByText("correttamente", {
      exact: false,
    });
    expect(notification).toBeInTheDocument();
    expect(getTransazioni).toBeCalled();
  });

  it("dovrebbe visualizzare il modal di modifica con i relativi dati già inseriti ed effettuare il salvataggio", async () => {
    server.use(
      http.get("/api/transazioni", () => {
        return HttpResponse.json(
          { result: [transazioni[0]], error: false },
          { status: 200 }
        );
      }),
      http.get("/api/categorie", () => {
        return HttpResponse.json(
          { result: categorie, error: false },
          { status: 200 }
        );
      }),
      http.patch(`/api/transazioni/${transazioni[0].id}`, () => {
        return HttpResponse.json(
          { result: transazioni[0], error: false },
          { status: 200 }
        );
      })
    );
    render(TransazioniComp);
    const menuButton = await screen.findByTestId("MenuButton");
    fireEvent.click(menuButton);
    const modificaButton = screen.getByTestId("ModificaButton");
    fireEvent.click(modificaButton);
    const modalTransazione = screen.getByTestId("ModalTransazione");
    expect(modalTransazione.hasChildNodes()).toBeTruthy();
    const selectCategoria =
      within(modalTransazione).getByLabelText("Categoria");
    const inputDescrizione =
      within(modalTransazione).getByLabelText("Descrizione");
    const inputData =
      within(modalTransazione).getByLabelText<HTMLInputElement>(
        "Data transazione"
      );
    const inputPrezzo = within(modalTransazione).getByLabelText("Prezzo");

    await waitFor(() =>
      expect(selectCategoria).toHaveValue(transazioni[0].categoria.nome)
    );
    expect(inputDescrizione).toHaveValue(transazioni[0].descrizione);
    const dataTransazioneSplit = inputData.value.split("/");
    expect(
      new Date(
        Number(dataTransazioneSplit[2]),
        Number(dataTransazioneSplit[1]) - 1,
        Number(dataTransazioneSplit[0])
      ).toLocaleDateString()
    ).toBe(transazioni[0].data.toLocaleDateString());
    expect(inputPrezzo).toHaveValue(Math.abs(transazioni[0].prezzo).toString());
    const salvaButton = within(modalTransazione).getByText("Salva");
    fireEvent.click(salvaButton);
    const notificaModifica = await screen.findByText("correttamente", {
      exact: false,
    });
    expect(notificaModifica).toBeInTheDocument();
  });

  it("dovrebbe visualizzare il modal di cancellazione se cliccato il pulsante elimina ed eliminare la transazione", async () => {
    server.use(
      http.get("/api/transazioni", () => {
        return HttpResponse.json(
          { result: [transazioni[0]], error: false },
          { status: 200 }
        );
      }),
      http.delete(`/api/transazioni/${transazioni[0].id}`, () => {
        return HttpResponse.json(
          { result: transazioni[0], error: false },
          { status: 200 }
        );
      })
    );

    render(TransazioniComp);
    const menuButton = await screen.findByTestId("MenuButton");
    fireEvent.click(menuButton);
    const eliminaButton = screen.getByTestId("EliminaButton");
    fireEvent.click(eliminaButton);
    const modalCancellazione = screen.getByTestId("ModalCancellazione");
    expect(modalCancellazione.hasChildNodes()).toBeTruthy();
    const deleteButton = within(modalCancellazione).getByText("Elimina");
    fireEvent.click(deleteButton);
    const notificaEliminazione = await screen.findByText("correttamente", {
      exact: false,
    });
    expect(notificaEliminazione).toBeInTheDocument();
  });
});
