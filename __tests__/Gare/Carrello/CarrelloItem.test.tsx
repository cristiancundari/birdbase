import { soggetti } from "@/__tests__/Soggetti/Soggetti";
import CarrelloItem from "@/components/gare/id/carrello/CarrelloItem";
import { render } from "@/setup-test";
import { fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import { gara } from "../Gare";

// Mock della funzione formatValuta
describe("CarrelloItem", () => {
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    render(
      <CarrelloItem
        soggetto={soggetti[0]}
        gara={gara}
        onDelete={mockOnDelete}
      />
    );
  });

  test("dovrebbe mostrare le informazioni del soggetto", () => {
    expect(screen.getByText("48XA-14-2023")).toBeInTheDocument();
    expect(screen.getByText(/100,00/)).toBeInTheDocument();
  });

  test("dovrebbe chiamare onDelete quando si clicca sull'icona di rimozione", () => {
    fireEvent.click(screen.getByTestId("rimuovi-soggetto"));
    expect(mockOnDelete).toHaveBeenCalledWith(soggetti[0].id);
  });

  test("dovrebbe mostrare l'icona corretta in base al sesso", () => {
    expect(screen.getByTestId("rimuovi-soggetto")).toBeInTheDocument();
    expect(screen.getByText("48XA-14-2023")).toBeInTheDocument();
    expect(screen.getByTestId("IconSessoMale")).toBeInTheDocument();
  });
});
