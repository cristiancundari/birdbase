import ItemPdf from "@/components/portafoglio/itemPdf";
import { render } from "@/setup-test";
import { TransazioneWithCategoria } from "@/types/types";
import { Table } from "@mantine/core";
import { screen } from "@testing-library/react";

describe("Componente ItemPdf", () => {
  const mockItem: TransazioneWithCategoria = {
    id: 1,
    categoriaId: 2,
    createdAt: new Date(),
    modificabile: true,
    profiloId: "profilo-1",
    data: new Date("2024-12-25"),
    categoria: { id: 2, nome: "Spesa" },
    descrizione: "Acquisto alimentari",
    prezzo: 50,
  };

  beforeEach(() => {
    render(
      <Table>
        <Table.Tbody>
          <ItemPdf item={mockItem} />
        </Table.Tbody>
      </Table>
    );
  });

  it("dovrebbe renderizzare correttamente i dati dell'item", () => {
    expect(screen.getByText("25/12/2024")).toBeInTheDocument();
    expect(screen.getByText("Spesa")).toBeInTheDocument();
    expect(screen.getByText("Acquisto alimentari")).toBeInTheDocument();
    expect(screen.getByText("50,00 €")).toBeInTheDocument();
  });
});
