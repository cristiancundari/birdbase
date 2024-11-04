import React from "react";
import { fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { mockGara } from "./Gara";
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
      <GaraCard gara={mockGara} onDelete={vi.fn()} onEdit={vi.fn()} />
    );
    expect(getByText(mockGara.titolo)).toBeInTheDocument();
  });

  it("dovrebbe visualizzare la tipologia della gara", () => {
    const { getByText } = render(
      <GaraCard gara={mockGara} onDelete={vi.fn()} onEdit={vi.fn()} />
    );
    expect(getByText(/Tipologia:/)).toBeInTheDocument();
    expect(getByText(mockGara.tipologia)).toBeInTheDocument();
  });

  it("dovrebbe mostrare i badge corretti", () => {
    const { getByText } = render(
      <GaraCard
        gara={{
          ...mockGara,
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

  it("dovrebbe mostrare il menu per l'admin", async () => {
    const { getByTestId } = render(
      <GaraCard gara={mockGara} onDelete={vi.fn()} onEdit={vi.fn()} />
    );

    const menuButton = getByTestId("menu-button");
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(getByTestId("menu-item-details")).toBeInTheDocument();
      expect(getByTestId("menu-item-edit")).toBeInTheDocument();
      expect(getByTestId("menu-item-delete")).toBeInTheDocument();
    });
  });

  it("dovrebbe chiamare onEdit quando viene selezionata l'opzione Modifica", async () => {
    const onEdit = vi.fn();
    const { getByTestId } = render(
      <GaraCard gara={mockGara} onDelete={vi.fn()} onEdit={onEdit} />
    );

    const menuButton = getByTestId("menu-button");
    fireEvent.click(menuButton);
    await waitFor(() => {
      fireEvent.click(getByTestId("menu-item-edit"));
    });

    expect(onEdit).toHaveBeenCalledWith(mockGara);
  });

  it("dovrebbe chiamare onDelete quando viene selezionata l'opzione Elimina", async () => {
    const onDelete = vi.fn();
    const { getByTestId } = render(
      <GaraCard gara={mockGara} onDelete={onDelete} onEdit={vi.fn()} />
    );

    const menuButton = getByTestId("menu-button");
    fireEvent.click(menuButton);
    await waitFor(() => {
      fireEvent.click(getByTestId("menu-item-delete"));
    });

    expect(onDelete).toHaveBeenCalledWith(mockGara.id);
  });
});
