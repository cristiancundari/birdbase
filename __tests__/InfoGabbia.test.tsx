import InfoGabbia from "@/components/InfoGabbia";
import { render } from "@/setup-test";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("<InfoGabbia />", () => {
  const gabbia = (gabbia: number | null, hideNull: boolean) => (
    <InfoGabbia gabbia={gabbia} hideNull={hideNull} />
  );
  it("dovrebbe visualizzare il - se non è presente il numero della gabbia", () => {
    render(gabbia(null, false));
    const icon = screen.queryByTestId("IconGabbia");
    const text = screen.queryByText("-");
    expect(icon).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });

  it("dovrebbe visualizzare il numero di gabbia con l'icona", () => {
    render(gabbia(5, false));
    const icon = screen.queryByTestId("IconGabbia");
    const text = screen.queryByText("5");
    expect(icon).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });

  it("dovrebbe nascondere il numero di gabbia se è null", () => {
    render(gabbia(null, true));
    const icon = screen.queryByTestId("IconGabbia");
    expect(icon).not.toBeInTheDocument();
  });
});
