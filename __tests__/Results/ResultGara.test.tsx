import RersultsPage from "@/app/results/[garaId]/page";
import { render } from "@/setup-test";
import { screen, waitFor } from "@testing-library/react";

import { redirect } from "next/navigation";
import { describe, expect, it, Mock, vi } from "vitest";

const mockedData = {
  id: "123",
  createdAt: "2023-12-12",
  titolo: "Prova",
  data: "2023-12-12",
  tipologia: "Canarini",
  citta: "Taormina",
  immagine: "link",
  nazioneId: "1",
  isDeleted: false,
  prezzo: 2,
  capienza: 100,
  iscrizioni: [
    {
      posizione: 2,
      voto: 85,
      soggetto: {
        id: "abcd",
        avatar: "avatar",
        rna: "rna1",
        numero: "99",
        anno: "2024",
        sesso: true,
        dataNascita: "2024-12-12",
      },
      profilo: {
        allevatore: {
          nome: "Mario",
          cognome: "Rossi",
          rna: "rna1",
        },
      },
    },
  ],
};

vi.mock("@/lib/prisma", () => ({
  prisma: {
    gara: {
      findFirst: () => {
        return mockedData;
      },
    },
  },
}));

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

describe("Pagina che visualizza il risultato di un soggetto ad una gara.", () => {
  it("Se non è presente la gara o il soggetto verra fatto il redirect alla home page.", async () => {
    render(await RersultsPage({ params: { garaId: "" }, searchParams: { s: "eadeeafc-bff7-4054-896e-afd97b6e5f30" } }));
    expect(redirect).toHaveBeenCalledWith("/app/home");
    render(await RersultsPage({ params: { garaId: "ef3abb19-6185-474d-ab64-5ce0c0c2b2ff" }, searchParams: { s: "" } }));
    expect(redirect).toHaveBeenCalledWith("/app/home");
  });

  it("Dovrebbe renderizzare i dati del risultato della gara", async () => {
    render(
      await RersultsPage({ params: { garaId: "ef3abb19-6185-474d-ab64-5ce0c0c2b2ff" }, searchParams: { s: "eadeeafc-bff7-4054-896e-afd97b6e5f30" } })
    );
    const allevatore = mockedData.iscrizioni[0].profilo.allevatore;
    await waitFor(() => expect(screen.getByText(`Complimenti ${allevatore.nome} ${allevatore.cognome}!`)));
    expect(screen.getByText(`Il tuo soggetto ha ottenuto un punteggio di ${mockedData.iscrizioni[0].voto}/100`));
    expect(screen.getByText(`piazzandosi alla posizione numero ${mockedData.iscrizioni[0].posizione} della classifica.`));
  });
});
