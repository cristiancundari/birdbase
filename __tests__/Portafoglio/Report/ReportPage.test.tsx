import { screen, fireEvent, waitFor } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import ReportPage from "@/app/app/portafoglio/report/page";
import { render } from "@/setup-test";
import { useReactToPrint } from "react-to-print";

vi.mock("@/lib/apiFetch", () => ({
  apiFetch: {
    get: vi.fn(),
  },
}));
vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<Object>();
  return {
    ...actual,
    useRouter: vi.fn(),
    useSearchParams: vi.fn(),
  };
});
vi.mock("react-to-print", () => ({
  useReactToPrint: vi.fn(),
}));

describe("Pagina Report Portafoglio", () => {
  let mockRouter: any;
  let mockData = [
    { id: "1", data: "2025-03-01", categoria: { nome: "Mangime" }, descrizione: "Mangime pappagalli", prezzo: 20 },
    { id: "2", data: "2025-03-02", categoria: { nome: "Gabbie" }, descrizione: "Voliera grande", prezzo: 385.85 },
  ];

  beforeEach(() => {
    mockRouter = { back: vi.fn() };
    (useRouter as Mock).mockReturnValue(mockRouter);
    (apiFetch.get as Mock).mockResolvedValue({ data: mockData, error: false });
    (useSearchParams as Mock).mockReturnValue(new ReadonlyURLSearchParams(new URLSearchParams({ dataFine: "", dataInizio: "", tipologia: "" })));
  });

  test("dovrebbe mostrare lo stato di caricamento", () => {
    render(<ReportPage />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  test("dovrebbe mostrare la tabella del report con i relativi dati", async () => {
    render(<ReportPage />);

    await waitFor(() => expect(apiFetch.get).toHaveBeenCalled());

    expect(screen.getByText("01/03/2025")).toBeInTheDocument();
    expect(screen.getByText("Mangime")).toBeInTheDocument();
    expect(screen.getByText("Mangime pappagalli")).toBeInTheDocument();
    expect(screen.getByText("20,00 €")).toBeInTheDocument();

    expect(screen.getByText("Totale")).toBeInTheDocument();
    expect(screen.getByText("405,85 €")).toBeInTheDocument();
  });

  test("dovrebbe chiamare router.back cliccando sul pulsante indietro", async () => {
    render(<ReportPage />);

    const btnIndietro = await waitFor(() => screen.getByTestId("btn_indietro"));
    fireEvent.click(btnIndietro);
    expect(mockRouter.back).toHaveBeenCalled();
  });

  test("dovrebbe chiamare handlePrint cliccando sul pulsante stampa", async () => {
    render(<ReportPage />);

    const btnStampa = await waitFor(() => screen.getByText("Stampa"));
    fireEvent.click(btnStampa);
    expect(useReactToPrint).toHaveBeenCalled();
  });
});
