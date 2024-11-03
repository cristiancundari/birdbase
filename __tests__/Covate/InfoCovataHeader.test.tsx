import { screen } from "@testing-library/react";
import { CovataWithGenitoriAndFigli } from "@/types/types";
import { vi } from "vitest";
import InfoCovataHeader from "@/components/covate/id/infoCovataHeader";
import { render } from "@/setup-test";
import { covate } from "./Covate";

describe("InfoCovataHeader", () => {
  const mockCovata: CovataWithGenitoriAndFigli = {
    ...covate[0],
    completata: true,
    data: new Date("2022-01-01"),
    uovaDeposte: 10,
    padre: {
      ...covate[0].padre,
      rna: "RNA-PADRE",
      numero: "123",
      anno: "2021",
    },
    madre: {
      ...covate[0].madre,
      rna: "RNA-MADRE",
      numero: "456",
      anno: "2021",
    },
    gabbia: 987,
    figli: Array(5).fill({}),
  };

  it("dovrebbe renderizzare correttamente le informazioni della covata", () => {
    render(<InfoCovataHeader covata={mockCovata} />);

    // Verifica se il titolo è presente
    expect(screen.getByText(/Info covata/i)).toBeInTheDocument();

    // Verifica se la data è formattata correttamente
    expect(screen.getByText("01/01/2022")).toBeInTheDocument();

    // Verifica se le informazioni sui genitori sono corrette
    expect(screen.getByText("RNA-PADRE-2021-123")).toBeInTheDocument();
    expect(screen.getByText("RNA-MADRE-2021-456")).toBeInTheDocument();

    // Verifica se le informazioni sulla gabbia sono visualizzate
    expect(screen.getByTestId("info-gabbia")).toHaveTextContent("987");

    // Verifica se le informazioni sulle uova sono visualizzate
    expect(screen.getByTestId("info-uova-deposte")).toHaveTextContent("10");
    expect(screen.getByTestId("info-uova-schiuse")).toHaveTextContent("5");
  });

  it("dovrebbe mostrare il componente Completata se completata è true", () => {
    render(<InfoCovataHeader covata={mockCovata} />);
    expect(screen.getByTestId("IconCompletata")).toBeInTheDocument();
  });
});
