import React from "react";
import GaraNonValida from "@/components/GaraNonValida";
import { render } from "@/setup-test";

describe("GaraNonValida", () => {
  it("dovrebbe mostrare il messaggio 'Gara non trovata'", () => {
    const { getByText } = render(<GaraNonValida />);
    expect(getByText("Gara non trovata")).toBeInTheDocument();
  });
});
