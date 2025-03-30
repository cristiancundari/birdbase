import FunzioneValutazione from "@/components/impostazioni/FunzioneValutazione";
import { render } from "@/setup-test";
import { describe, it, Mock, vi } from "vitest";
import { mockProfilo } from "../Profilo";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { apiFetch } from "@/lib/apiFetch";
import { evaluate } from "@/lib/parser/evaluator";
import { act } from "react";

describe("Componente FunzioneValutazione", () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });

  vi.mock("@/lib/apiFetch", () => ({
    apiFetch: {
      patch: vi.fn().mockResolvedValue({
        error: false,
        data: {},
      }),
    },
  }));

  vi.mock("@/lib/parser/evaluator", () => ({
    evaluate: vi.fn().mockImplementation(() => 8),
  }));

  it("Dovrebbe renderizzare il componente", () => {
    render(<FunzioneValutazione user={mockProfilo} />);
    expect(screen.getByText("Scegli la formula di valutazione")).toBeInTheDocument();
  });

  it("Dovrebbe effettuare il salvataggio del dato", () => {
    render(<FunzioneValutazione user={mockProfilo} />);
    const btnSalva = screen.getByText("Salva");
    expect(btnSalva).toBeInTheDocument();
    fireEvent.click(btnSalva);
    expect(apiFetch.patch).toHaveBeenCalledWith("/api/impostazioni", {
      formulaData: mockProfilo.formulaData,
      formulaParentela: mockProfilo.formulaParentela,
      percentualeFormulaData: mockProfilo.percentualeFormulaData,
    });
  });

  it("Dovrebbe ricalcolare le formule ogni volta che gli input vengono modificati", async () => {
    render(<FunzioneValutazione user={mockProfilo} />);
    const formulaData = screen.getByLabelText("Formula per data");
    expect(formulaData).toBeInTheDocument();
    const formulaParentela = screen.getByLabelText("Formula per parentela");
    expect(formulaParentela).toBeInTheDocument();

    fireEvent.change(formulaData, { target: { value: "x" } });

    await waitFor(() => expect(evaluate).toHaveBeenCalledWith("x", expect.any(Number)));

    fireEvent.change(formulaParentela, { target: { value: "x + 1" } });

    await waitFor(() => expect(evaluate).toHaveBeenCalledWith("x + 1", expect.any(Number)));
  });

  it("Dovrebbe rilevare errori nella formula", async () => {
    vi.mock("@/lib/parser/evaluator", () => ({
      evaluate: vi.fn().mockImplementation(() => {
        throw new Error("Impossibile dividere per 0");
      }),
    }));

    render(<FunzioneValutazione user={mockProfilo} />);
    const formulaData = screen.getByLabelText("Formula per data");
    expect(formulaData).toBeInTheDocument();
    const formulaParentela = screen.getByLabelText("Formula per parentela");
    expect(formulaParentela).toBeInTheDocument();

    fireEvent.change(formulaData, { target: { value: "x / 0" } });

    await waitFor(() => expect(evaluate).toHaveBeenCalledWith("x / 0", expect.any(Number)));
    await waitFor(() => expect(screen.getAllByText("Impossibile dividere per 0")).toHaveLength(2));
  });
});
