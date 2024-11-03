import React from "react";
import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { gara } from "./Gare";
import { Role } from "@prisma/client";
import { useSupabase } from "@/providers/SupabaseProvider";
import GaraCard from "@/components/gare/GaraCard";
import { render } from "@/setup-test";

// Mock per useSupabase
vi.mock("@/providers/SupabaseProvider", () => ({
  useSupabase: () => ({
    user: { ruolo: Role.ADMIN },
  }),
}));

describe("GaraCard", () => {
  it("dovrebbe visualizzare il titolo della gara", () => {
    const { getByText } = render(
      <GaraCard gara={gara} onDelete={vi.fn()} onEdit={vi.fn()} />
    );
    expect(getByText(gara.titolo)).toBeInTheDocument();
  });

  it("dovrebbe visualizzare la tipologia della gara", () => {
    const { getByText } = render(
      <GaraCard gara={gara} onDelete={vi.fn()} onEdit={vi.fn()} />
    );
    expect(getByText(/Tipologia:/)).toBeInTheDocument();
    expect(getByText(gara.tipologia)).toBeInTheDocument();
  });

  it("dovrebbe mostrare i badge corretti", () => {
    const { getByText } = render(
      <GaraCard
        gara={{
          ...gara,
          isDeleted: false,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Gara nuova
          stato: "BOZZA",
        }}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    expect(getByText("Nuovo")).toBeInTheDocument();
    expect(getByText("Bozza")).toBeInTheDocument();
  });

  it("dovrebbe mostrare il menu per l'admin", () => {
    const { getByTestId } = render(
      <GaraCard gara={gara} onDelete={vi.fn()} onEdit={vi.fn()} />
    );

    const menuButton = getByTestId("menu-button");
    fireEvent.click(menuButton);

    expect(getByTestId("menu-item-details")).toBeInTheDocument();
    expect(getByTestId("menu-item-edit")).toBeInTheDocument();
    expect(getByTestId("menu-item-delete")).toBeInTheDocument();
  });

  it("dovrebbe chiamare onEdit quando viene selezionata l'opzione Modifica", () => {
    const onEdit = vi.fn();
    const { getByTestId } = render(
      <GaraCard gara={gara} onDelete={vi.fn()} onEdit={onEdit} />
    );

    const menuButton = getByTestId("menu-button");
    fireEvent.click(menuButton);
    fireEvent.click(getByTestId("menu-item-edit"));

    expect(onEdit).toHaveBeenCalledWith(gara);
  });

  it("dovrebbe chiamare onDelete quando viene selezionata l'opzione Elimina", () => {
    const onDelete = vi.fn();
    const { getByTestId } = render(
      <GaraCard gara={gara} onDelete={onDelete} onEdit={vi.fn()} />
    );

    const menuButton = getByTestId("menu-button");
    fireEvent.click(menuButton);
    fireEvent.click(getByTestId("menu-item-delete"));

    expect(onDelete).toHaveBeenCalledWith(gara.id);
  });
});
