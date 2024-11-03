import React from "react";
import Breadcrumb from "@/components/Breadcrumb"; // Assicurati che il percorso sia corretto
import { describe, expect, it } from "vitest";
import { render } from "@/setup-test";

describe("Breadcrumb", () => {
  it("dovrebbe visualizzare i breadcrumb correttamente", () => {
    const items = [
      { title: "Home", href: "/" },
      { title: "Prodotti", href: "/prodotti" },
      { title: "Dettagli", href: "/prodotti/dettagli" },
    ];

    const { getByText } = render(<Breadcrumb items={items} />);

    items.forEach((item) => {
      expect(getByText(item.title)).toBeInTheDocument();
    });
  });

  it("dovrebbe avere il numero corretto di elementi", () => {
    const items = [
      { title: "Home", href: "/" },
      { title: "Contatti", href: "/contatti" },
    ];

    const { container } = render(<Breadcrumb items={items} />);

    const anchors = container.querySelectorAll("a");
    expect(anchors.length).toBe(items.length);
  });

  it("dovrebbe avere i link corretti", () => {
    const items = [
      { title: "Home", href: "/" },
      { title: "Blog", href: "/blog" },
    ];

    const { getByText } = render(<Breadcrumb items={items} />);

    items.forEach((item) => {
      expect(getByText(item.title).closest("a")).toHaveAttribute(
        "href",
        item.href
      );
    });
  });
});
