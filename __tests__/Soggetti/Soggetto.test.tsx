import { Soggetto } from "@prisma/client";
import { soggetti } from "./Soggetti";

import HomePage from "@/app/app/home/page";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import assert from "assert";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import SoggettoComp from "../../components/SoggettoComp";
import server from "../ServerMock";
import { render } from "@/setup-test";
import ModalSoggetto from "@/components/home/ModalSoggetto";
import { debug } from "vitest-preview";

//sesso = true significa "Maschio" ---- sesso = false significa "Femmina" ---- sesso = null significa "In Attesa"
describe("<SoggettoComp />", () => {
  const soggettoComp = (soggetto: Soggetto) => (
    <SoggettoComp sogg={soggetto} menu={[]} onPreferito={async () => null} />
  );

  it("dovrebbe visualizzare l'icona del sesso maschio", () => {
    const soggMaschio: Soggetto | undefined = soggetti.find(
      (s) => s.sesso == true
    ); //Maschio
    assert(soggMaschio);
    render(soggettoComp(soggMaschio));
    const icon = screen.queryByTestId("IconSessoMale");
    expect(icon).toBeInTheDocument();
  });

  it("dovrebbe visualizzare l'icona del sesso femmina", () => {
    const soggFemmina: Soggetto | undefined = soggetti.find(
      (s) => s.sesso == false
    ); //Femmina
    assert(soggFemmina);
    render(soggettoComp(soggFemmina));
    const icon = screen.queryByTestId("IconSessoFemale");
    expect(icon).toBeInTheDocument();
  });

  it("dovrebbe visualizzare l'icona del sesso in attesa", () => {
    const soggInAttesa: Soggetto | undefined = soggetti.find(
      (s) => s.sesso == null
    ); //In attesa
    assert(soggInAttesa);
    render(soggettoComp(soggInAttesa));
    const icon = screen.queryByTestId("IconSessoAgender");
    expect(icon).toBeInTheDocument();
  });

  it("dovrebbe mostrare l'icona morto se il soggetto è morto e nascondere l'icona della gabbia (se valorizzata)", () => {
    const soggettoMorto = soggetti.find(
      (s) => s.isMorto == true && s.gabbia != null
    );
    assert(soggettoMorto);
    render(soggettoComp(soggettoMorto));
    const iconMorto = screen.queryByTestId("IconMorto");
    const iconGabbia = screen.queryByTestId("IconGabbia");
    expect(iconMorto).toBeInTheDocument();
    expect(iconGabbia).not.toBeInTheDocument();
  });

  it("dovrebbe mostrare l'icona della gabbia (se valorizzata) se è vivo", () => {
    const soggettoVivo = soggetti.find(
      (s) => s.isMorto == false && s.gabbia != null
    );
    assert(soggettoVivo);
    render(soggettoComp(soggettoVivo));
    const iconGabbia = screen.queryByTestId("IconGabbia");
    expect(iconGabbia).toBeInTheDocument();
  });

  it("dovrebbe nascondere l'icona della gabbia (se non valorizzata) se è vivo", () => {
    const soggettoVivo = soggetti.find(
      (s) => s.isMorto == false && s.gabbia == null
    );
    assert(soggettoVivo);
    render(soggettoComp(soggettoVivo));
    const iconGabbia = screen.queryByTestId("IconGabbia");
    expect(iconGabbia).not.toBeInTheDocument();
  });

  it("dovrebbe mostrare l'icona della nota se valorizzata", async () => {
    const soggetto = soggetti.find((s) => s.note.length > 0);
    assert(soggetto);
    render(soggettoComp(soggetto));
    const iconNote = screen.getByTestId("IconNote");
    expect(iconNote).toBeInTheDocument();
  });

  it("dovrebbe mostrare la nota se valorizzata quando si passa col mouse sull'icona", async () => {
    const soggetto = soggetti.find((s) => s.note.length > 0);
    assert(soggetto);
    render(soggettoComp(soggetto));
    const iconNote = screen.getByTestId("IconNote");
    expect(iconNote).toBeInTheDocument();
    const textNoteBefore = screen.queryByText(soggetto.note, {
      trim: false,
      collapseWhitespace: false,
    });
    expect(textNoteBefore).not.toBeInTheDocument();
    fireEvent.mouseOver(iconNote);
    const textNoteAfter = screen.getByText(soggetto.note, {
      trim: false,
      collapseWhitespace: false,
    });
    expect(textNoteAfter).toBeInTheDocument();
  });

  it("dovrebbe nascondere l'icona della nota se stringa vuota", () => {
    const soggetto = soggetti.find((s) => s.note.length == 0);
    assert(soggetto);
    render(soggettoComp(soggetto));
    const iconNote = screen.queryByTestId("IconNote");
    expect(iconNote).not.toBeInTheDocument();
  });

  it("dovrebbe mostrare l'icona attiva del preferito se il soggetto è impostato come preferito", () => {
    const soggettoPreferito = soggetti.find((s) => s.preferito == true);
    assert(soggettoPreferito);
    render(soggettoComp(soggettoPreferito));
    const iconaPreferito = screen.getByTestId("IconPreferito");
    expect(iconaPreferito).toBeInTheDocument();
  });

  it("dovrebbe mostrare l'icona non attiva del preferito se il soggetto non è impostato come preferito", () => {
    const soggettoNonPreferito = soggetti.find((s) => s.preferito == false);
    assert(soggettoNonPreferito);
    render(soggettoComp(soggettoNonPreferito));
    const iconaNonPreferito = screen.getByTestId("IconNonPreferito");
    expect(iconaNonPreferito).toBeInTheDocument();
  });

  it("dovrebbe mostrare l'identificativo dell'anelletto come RNA-Anno-Numero", () => {
    const soggetto = soggetti[0];
    render(soggettoComp(soggetto));
    const anelletto = screen.getByText(
      soggetto.rna + "-" + soggetto.anno + "-" + soggetto.numero
    );
    expect(anelletto).toBeInTheDocument();
  });

  it("dovrebbe mostrare l'immagine del soggetto se ne esiste una", () => {
    const soggettoConImmagine = soggetti.find((s) => s.avatar);
    assert(soggettoConImmagine);
    assert(soggettoConImmagine.avatar);
    render(soggettoComp(soggettoConImmagine));
    const avatar = screen.getByTestId("ImgAvatar").querySelector("img");
    const path = avatar?.getAttribute("src");
    expect(path?.includes(soggettoConImmagine.avatar)).toBeTruthy();
  });

  it("dovrebbe mostrare un placeholder come immagine del soggetto se non ne esiste una", () => {
    const soggettoSenzaImmagine = soggetti.find((s) => s.avatar == null);
    assert(soggettoSenzaImmagine);
    render(soggettoComp(soggettoSenzaImmagine));
    const avatar = screen.getByTestId("ImgAvatar").querySelector("img");
    const path = avatar?.getAttribute("src");
    expect(path?.includes("https://images.placeholders.dev")).toBeTruthy();
  });
});

describe("Soggetto CRUD", () => {
  it("dovrebbe renderizzare la home page mostrando tutti i soggetti", async () => {
    server.use(
      http.get("/api/soggetti", () => {
        return HttpResponse.json(
          { result: soggetti, error: false },
          { status: 200 }
        );
      })
    );
    render(<HomePage />);
    const soggettiComp = await screen.findAllByTestId("SoggettoComp");
    expect(soggettiComp.length).toBe(soggetti.length);
  });

  it("dovrebbe mostrare il componente 'nessun soggetto' se l'API non restituisce nessun elemento", async () => {
    server.use(
      http.get("/api/soggetti", () => {
        return HttpResponse.json({ result: [], error: false }, { status: 200 });
      })
    );
    render(<HomePage />);
    const soggettiComp = await waitFor(() =>
      screen.queryAllByTestId("SoggettoComp")
    );
    expect(soggettiComp.length).toBe(0);
    const nessunSoggetto = await screen.findByTestId("NessunSoggetto");
    expect(nessunSoggetto).toBeInTheDocument();
  });

  it("dovrebbe aprire il modal quando viene premuto il pulsante aggiungi", () => {
    render(<HomePage />);
    const buttonAggiungi = screen.getByTestId("ButtonAggiungi");
    const modalSoggettoBefore = screen.getByTestId("ModalSoggetto");
    expect(modalSoggettoBefore.hasChildNodes()).toBeFalsy();

    fireEvent.click(buttonAggiungi);
    const modalSoggettoAfter = screen.getByTestId("ModalSoggetto");
    expect(modalSoggettoAfter.hasChildNodes()).toBeTruthy();
    expect(modalSoggettoAfter).toHaveTextContent("Aggiungi Soggetto");
  });

  it("dovrebbe effettuare un inserimeto se cliccato il pulsante salva", async () => {
    server.use(
      http.post("/api/soggetti", () => {
        return HttpResponse.json(
          { result: soggetti[0], error: false },
          { status: 200 }
        );
      })
    );
    render(<HomePage />);
    const buttonAggiungi = screen.getByTestId("ButtonAggiungi");
    fireEvent.click(buttonAggiungi);

    const modalSoggetto = screen.getByTestId("ModalSoggetto");
    expect(modalSoggetto).toBeInTheDocument();
    const rna = screen.getByLabelText("RNA");
    const numero = screen.getByLabelText("Numero");
    const anno = screen.getByLabelText("Anno");
    const buttonSalva = screen.getByTestId("ButtonSalva");
    fireEvent.change(rna, { target: { value: soggetti[0].rna } });
    fireEvent.change(numero, { target: { value: soggetti[0].numero } });
    fireEvent.change(anno, { target: { value: soggetti[0].anno } });
    fireEvent.click(buttonSalva);
    const messaggioSoggettoInserito = await screen.findByText("successo", {
      exact: false,
    });
    expect(messaggioSoggettoInserito).toBeInTheDocument();
  });

  it("dovrebbe effettuare la cancellazione del soggetto se cliccato il pulsante elimina del modal", async () => {
    server.use(
      http.get("/api/soggetti", () => {
        return HttpResponse.json(
          { result: [soggetti[0]], error: false },
          { status: 200 }
        );
      }),
      http.delete(`/api/soggetti/${soggetti[0].id}`, () => {
        return HttpResponse.json(
          { result: soggetti[0], error: false },
          { status: 200 }
        );
      })
    );

    render(<HomePage />);
    const menuButton = await screen.findByTestId("MenuButton");
    fireEvent.click(menuButton);
    const eliminaButton = screen.getByText("Elimina");
    fireEvent.click(eliminaButton);
    const modalCancellazione = screen.getByTestId("ModalCancellazione");
    expect(modalCancellazione.hasChildNodes()).toBeTruthy();
    const buttonConferma = within(modalCancellazione).getByText("Elimina");
    fireEvent.click(buttonConferma);
    const notification = await screen.findByText("successo", {
      exact: false,
    });
    expect(notification).toBeInTheDocument();
  });

  it("dovrebbe mostrare il modal in modalità di modifica e modificare il soggetto", async () => {
    const soggettoDaModificare = soggetti[0];
    const rnaModificato = "99AA";

    server.use(
      http.get("/api/soggetti", () => {
        return HttpResponse.json(
          { result: [soggettoDaModificare], error: false },
          { status: 200 }
        );
      }),
      http.patch(`/api/soggetti/${soggettoDaModificare.id}`, () => {
        return HttpResponse.json(
          {
            result: { ...soggettoDaModificare, rna: rnaModificato },
            error: false,
          },
          { status: 200 }
        );
      })
    );

    render(<HomePage />);

    const menuButton = await screen.findByTestId("MenuButton");
    fireEvent.click(menuButton);
    const modificaButton = screen.getByText("Modifica");
    fireEvent.click(modificaButton);

    const modalSoggetto = screen.getByTestId("ModalSoggetto");
    expect(modalSoggetto).toHaveTextContent("Modifica Soggetto");

    const rna = within(modalSoggetto).getByLabelText("RNA");
    fireEvent.change(rna, { target: { value: rnaModificato } });
    const buttonSalva = within(modalSoggetto).getByTestId("ButtonSalva");
    fireEvent.click(buttonSalva);
    const messaggioSoggettoModificato = await screen.findByText("successo", {
      exact: false,
    });
    expect(messaggioSoggettoModificato).toBeInTheDocument();
  });

  it("dovrebbe impostare il soggetto come preferito se si clicca la relativa icona", async () => {
    const soggettoDaModificare = soggetti.find((s) => s.preferito == false);
    assert(soggettoDaModificare);

    server.use(
      http.get("/api/soggetti", () => {
        return HttpResponse.json(
          { result: [soggettoDaModificare], error: false },
          { status: 200 }
        );
      }),
      http.put(`/api/soggetti/${soggettoDaModificare.id}`, () => {
        return HttpResponse.json(
          {
            result: { ...soggettoDaModificare, preferito: true },
            error: false,
          },
          { status: 200 }
        );
      })
    );

    render(<HomePage />);

    const preferitoButton = await screen.findByTestId("ButtonPreferito");

    const iconPreferitoBefore = screen.queryByTestId("IconPreferito");
    const iconNonPreferitoBefore = screen.queryByTestId("IconNonPreferito");

    expect(iconPreferitoBefore).not.toBeInTheDocument();
    expect(iconNonPreferitoBefore).toBeInTheDocument();

    fireEvent.click(preferitoButton);

    const iconPreferitoAfter = screen.queryByTestId("IconPreferito");
    const iconNonPreferitoAfter = screen.queryByTestId("IconNonPreferito");

    waitFor(() => {
      expect(iconPreferitoAfter).toBeInTheDocument();
      expect(iconNonPreferitoAfter).not.toBeInTheDocument();
    });
  });
});
