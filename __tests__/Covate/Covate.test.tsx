import CovataComp from "@/components/covate/covataComp";
import CovatePage from "@/components/covate/covatePage";
import { render } from "@/setup-test";
import { CovataWithGenitori, SoggettoWithParentela } from "@/types/types";
import { fireEvent, screen, waitFor, within } from "@testing-library/dom";
import assert from "assert";
import { HttpResponse, http } from "msw";
import { describe, expect, it, vi } from "vitest";
import server from "../ServerMock";
import { soggetti } from "../Soggetti/Soggetti";
import { covate } from "./Covate";

describe("Covate CRUD", () => {
  it("dovrebbe ottenere tutte le covate", async () => {
    server.use(
      http.get("/api/covate", () => {
        return HttpResponse.json(
          { result: covate, error: false },
          { status: 200 }
        );
      })
    );
    render(<CovatePage />);
    const covateComp = await screen.findAllByTestId("CovataComp");
    expect(covateComp.length).toBe(covate.length);
  });

  it("dovrebbe aprire il modal cliccando il bottone aggiungi e salvare la covata cliccando il bottone salva", async () => {
    const newCovata: CovataWithGenitori = {
      id: 14,
      createdAt: new Date("2023-12-27T12:29:51.719Z"),
      data: new Date("2023-12-22T00:00:00.000Z"),
      uovaDeposte: 3,
      idPadre: "02e92a94-642f-410c-923a-900efbe0c4a9",
      idMadre: "03ce13e5-58d1-438e-92c8-50c30df75be5",
      gabbia: 7,
      profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
      completata: true,
      madre: {
        id: "03ce13e5-58d1-438e-92c8-50c30df75be5",
        sesso: false,
        dataNascita: new Date("2023-12-07T00:00:00.000Z"),
        gabbia: null,
        rna: "48XA",
        numero: "3",
        anno: "2023",
        note: "",
        preferito: false,
        profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
        avatar: null,
        covataId: 12,
        isMorto: false,
      },
      padre: {
        id: "02e92a94-642f-410c-923a-900efbe0c4a9",
        sesso: true,
        dataNascita: new Date("2023-12-06T00:00:00.000Z"),
        gabbia: null,
        rna: "48XA",
        numero: "2",
        anno: "2023",
        note: "",
        preferito: false,
        profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
        avatar: null,
        covataId: 13,
        isMorto: true,
      },
    };
    const parentele: SoggettoWithParentela[] = [
      {
        soggetto: {
          id: "07055181-cf40-4f25-bb8e-1f19cddf5ef4",
          sesso: false,
          dataNascita: new Date("2023-12-16T00:00:00.000Z"),
          gabbia: null,
          rna: "48XA",
          numero: "7",
          anno: "2023",
          note: "",
          preferito: false,
          profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
          avatar: null,
          covataId: 8,
          isMorto: false,
        },
        parentela: {
          nome: "Figlio",
          percentuale: 90,
          plurale: "Figli",
          colore: "red",
        },
      },
    ];
    const soggettoPadre = soggetti.find((s) => s.sesso);
    assert(soggettoPadre);

    server.use(
      http.post("api/covate", () => {
        return HttpResponse.json(
          { result: newCovata, error: false },
          { status: 200 }
        );
      }),
      http.get("api/soggetti", () => {
        return HttpResponse.json(
          { result: soggetti, error: false },
          { status: 200 }
        );
      }),
      http.get(
        `/api/covate/parentele?soggetto=${soggettoPadre.id}&only_partners=true`,
        () => {
          return HttpResponse.json(
            {
              result: parentele,
              error: false,
            },
            { status: 200 }
          );
        }
      )
    );
    render(<CovatePage />);

    const buttonAggiungi = screen.getByTestId("ButtonAggiungi");
    fireEvent.click(buttonAggiungi);

    const modalCovata = screen.getByTestId("ModalCovata");
    const titolo = screen.getByText("Aggiungi Covata");
    expect(modalCovata.hasChildNodes()).toBeTruthy();
    expect(titolo).toBeInTheDocument();

    const loaders = within(modalCovata).getAllByTestId("Loader");
    await waitFor(() => {
      loaders.forEach((loader) => {
        expect(loader).not.toBeInTheDocument();
      });
    });

    const completata = within(modalCovata).getByLabelText("Completata");
    const dataCovata = within(modalCovata).getByLabelText("Data Covata");
    const gabbia = within(modalCovata).getByLabelText("Gabbia");
    const uovaDeposte = within(modalCovata).getByLabelText("Uova Deposte");

    fireEvent.change(completata, { target: { value: newCovata.completata } });
    fireEvent.change(dataCovata, { target: { value: newCovata.data } });
    fireEvent.change(gabbia, { target: { value: newCovata.gabbia } });
    fireEvent.change(uovaDeposte, { target: { value: newCovata.uovaDeposte } });

    const comboboxPadreOption = within(modalCovata).getByText(
      `${soggettoPadre.rna}-${soggettoPadre.anno}-${soggettoPadre.numero}`
    );
    fireEvent.click(comboboxPadreOption);

    const loaderFemmine = within(modalCovata).getByTestId("Loader");
    expect(loaderFemmine).toBeInTheDocument();
    await waitFor(() => {
      expect(loaderFemmine).not.toBeInTheDocument();
    });

    const parenteFemmina = parentele[0].soggetto;
    const comboboxMadreOption = await within(modalCovata).findByText(
      `${parenteFemmina.rna}-${parenteFemmina.anno}-${parenteFemmina.numero}`
    );
    fireEvent.click(comboboxMadreOption);

    assert(parentele[0].parentela);
    const nomeParentela = within(modalCovata).getByText(
      parentele[0].parentela.nome
    );
    expect(nomeParentela).toBeInTheDocument();

    const buttonSalva = screen.getByTestId("ButtonSalva");
    fireEvent.click(buttonSalva);

    const notification = await screen.findByText("correttamente", {
      exact: false,
    });
    expect(notification).toBeInTheDocument();
  });

  it("dovrebbe aprire il modal in modalità di modifica se cliccato il bottone MODIFICA ed effettuare il salvataggio se cliccato su salva", async () => {
    const covata = covate[0];
    const newGabbia = 100;
    server.use(
      http.get("/api/covate", () => {
        return HttpResponse.json(
          { result: [covata], error: false },
          { status: 200 }
        );
      }),
      http.patch(`/api/covate/${covata.id}`, () => {
        return HttpResponse.json(
          { result: { ...covata, gabbia: newGabbia }, error: false },
          { status: 200 }
        );
      })
    );
    render(<CovatePage />);
    const buttonMenu = await screen.findByTestId("ButtonMenu");
    fireEvent.click(buttonMenu);

    const buttonModifica = screen.getByTestId("ButtonModifica");
    fireEvent.click(buttonModifica);

    const modalCovata = screen.getByTestId("ModalCovata");
    const titolo = screen.getByText("Modifica Covata");
    expect(modalCovata.hasChildNodes()).toBeTruthy();
    expect(titolo).toBeInTheDocument();
    const gabbia = within(modalCovata).getByLabelText("Gabbia");
    fireEvent.change(gabbia, { target: { value: newGabbia } });

    server.use(
      http.get("/api/covate", () => {
        return HttpResponse.json(
          { result: [{ ...covata, gabbia: newGabbia }], error: false },
          { status: 200 }
        );
      })
    );
    const buttonSalva = screen.getByTestId("ButtonSalva");
    fireEvent.click(buttonSalva);

    const notification = await screen.findByText("correttamente", {
      exact: false,
    });
    expect(notification).toBeInTheDocument();

    const gabbiaAfter = await screen.findByText(newGabbia.toString());
    expect(gabbiaAfter).toBeInTheDocument();
  });

  it("dovrebbe eliminare la covata se cliccato il pulsante elimina", async () => {
    const covata = covate[0];
    server.use(
      http.get("/api/covate", () => {
        return HttpResponse.json(
          { result: [covata], error: false },
          { status: 200 }
        );
      }),
      http.delete(`/api/covate/${covata.id}`, () => {
        return HttpResponse.json(
          { result: covata, error: false },
          { status: 200 }
        );
      })
    );

    render(<CovatePage />);
    const buttonMenu = await screen.findByTestId("ButtonMenu");
    fireEvent.click(buttonMenu);

    const buttonElimina = screen.getByTestId("ButtonElimina");
    fireEvent.click(buttonElimina);
    const modalCancellazione = screen.getByTestId("ModalCancellazione");
    expect(modalCancellazione.hasChildNodes()).toBeTruthy();

    const apiGet = vi.fn();
    server.use(http.get("/api/covate", apiGet));
    const buttonConferma = within(modalCancellazione).getByText("Elimina");
    fireEvent.click(buttonConferma);

    const notification = await screen.findByText("correttamente", {
      exact: false,
    });
    expect(notification).toBeInTheDocument();
    expect(apiGet).toBeCalled();
  });
});

describe("<CovataComp/>", () => {
  it("dovrebbe visualizzare la gabbia se è presente", () => {
    const covataConGabbia = covate.find((c) => c.gabbia);
    assert(covataConGabbia);
    render(
      <CovataComp
        covata={covataConGabbia}
        modalElimina={vi.fn()}
        modalModifica={vi.fn()}
      />
    );
    const iconGabbia = screen.getByTestId("IconGabbia");
    expect(iconGabbia).toBeInTheDocument();
  });

  it("dovrebbe nascondere la gabbia se non è presente", () => {
    const covataConGabbia = covate.find((c) => c.gabbia == null);
    assert(covataConGabbia);
    render(
      <CovataComp
        covata={covataConGabbia}
        modalElimina={vi.fn()}
        modalModifica={vi.fn()}
      />
    );
    const iconGabbia = screen.queryByTestId("IconGabbia");
    expect(iconGabbia).not.toBeInTheDocument();
  });

  it("dovrebbe visualizzare l'icona covata completata se settata", () => {
    const covataCompletata = covate.find((c) => c.completata);
    assert(covataCompletata);
    render(
      <CovataComp
        covata={covataCompletata}
        modalElimina={vi.fn()}
        modalModifica={vi.fn()}
      />
    );
    const iconCompletata = screen.getByTestId("IconCompletata");
    expect(iconCompletata).toBeInTheDocument();
  });

  it("dovrebbe nascondere l'icona covata completata se settata", () => {
    const covataCompletata = covate.find((c) => c.completata == false);
    assert(covataCompletata);
    render(
      <CovataComp
        covata={covataCompletata}
        modalElimina={vi.fn()}
        modalModifica={vi.fn()}
      />
    );
    const iconCompletata = screen.queryByTestId("IconCompletata");
    expect(iconCompletata).not.toBeInTheDocument();
  });
});
