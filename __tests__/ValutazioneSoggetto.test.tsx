import ValutazioneSoggetto from "@/components/ValutazioneSoggetto";
import { render } from "@/setup-test";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";

describe("Componente ValutazioneSoggetto", () => {
  it("Dovrebbe renderizzare il componente", () => {
    render(<ValutazioneSoggetto valutazione={87} />);
    const badge = screen.getByText("87");
    expect(badge).toBeInTheDocument();
  });

  it("Dovrebbe renderizzare colori differenti in base alla valutazione", () => {
    // RED
    render(<ValutazioneSoggetto valutazione={87} />);
    let badge = screen.getByText("87");
    expect(badge).toBeInTheDocument();

    expect(badge.parentElement).toHaveAttribute("style", expect.stringContaining("color-red"));

    // YELLOW
    render(<ValutazioneSoggetto valutazione={60} />);
    badge = screen.getByText("60");
    expect(badge).toBeInTheDocument();

    expect(badge.parentElement).toHaveAttribute("style", expect.stringContaining("color-yellow"));

    // LIME
    render(<ValutazioneSoggetto valutazione={40} />);
    badge = screen.getByText("40");
    expect(badge).toBeInTheDocument();

    expect(badge.parentElement).toHaveAttribute("style", expect.stringContaining("color-lime"));

    // TEAL
    render(<ValutazioneSoggetto valutazione={20} />);
    badge = screen.getByText("20");
    expect(badge).toBeInTheDocument();

    expect(badge.parentElement).toHaveAttribute("style", expect.stringContaining("color-teal"));
  });
});
