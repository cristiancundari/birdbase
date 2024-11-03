import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";
import PortafoglioPage from "@/components/portafoglio/portafoglioPage";
import { render } from "@/setup-test";
import ModalReport from "@/components/portafoglio/modalReport";
import { debug } from "vitest-preview";

// Mock del router
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("PortafoglioPage", () => {
  const mockRouterPush = vi.fn();

  beforeEach(() => {
    // Resetta i mock prima di ogni test
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockRouterPush });
  });

  test("renderizza correttamente la pagina", () => {
    render(<PortafoglioPage />);

    expect(screen.getByText("Genera Report")).toBeInTheDocument();
  });

  test("apre il modal report quando si clicca sul pulsante 'Genera Report'", async () => {
    render(<PortafoglioPage />);

    const button = screen.getByText("Genera Report");

    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText("Genera Report")).toBeInTheDocument();
    });
  });

  test("chiude il modal report quando si preme il tasto annulla", async () => {
    render(<PortafoglioPage />);

    const button = screen.getByText("Genera Report");
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByTestId("modal-report-test").childNodes.length
      ).toBeGreaterThan(0);
    });

    const annulla = screen.getByTestId("button-annulla-test");
    fireEvent.click(annulla);

    await waitFor(() => {
      expect(
        screen.getByTestId("modal-report-test").childNodes.length
      ).toBeLessThanOrEqual(0);
    });
  });

  test("invoca il router push con i dati corretti quando si invia il report", async () => {
    render(<PortafoglioPage />);

    const button = screen.getByText("Genera Report");
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByTestId("modal-report-test").childNodes.length
      ).toBeGreaterThan(0);
    });

    const invia = screen.getByTestId("button-invia-test");
    fireEvent.click(invia);

    expect(mockRouterPush).toHaveBeenCalledWith(
      expect.stringContaining("/app/portafoglio/report?")
    );
  });
});
