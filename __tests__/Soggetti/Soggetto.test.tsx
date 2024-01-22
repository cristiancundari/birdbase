import "@testing-library/jest-dom";
import { Soggetto } from "@prisma/client";
import { soggetti } from "./Soggetti";
import {
  fireEvent,
  getDefaultNormalizer,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import SoggettoComp from "@/components/SoggettoComp";
import assert from "assert";
import LayoutProviders from "@/app/layoutProviders";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import HomePage from "@/app/app/home/page";

//sesso = true significa "Maschio" ---- sesso = false significa "Femmina" ---- sesso = null significa "In Attesa"
describe("<SoggettoComp />", () => {
  const soggettoComp = (soggetto: Soggetto) => (
    <LayoutProviders>
      <SoggettoComp sogg={soggetto} menu={[]} onPreferito={async () => null} />
    </LayoutProviders>
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
