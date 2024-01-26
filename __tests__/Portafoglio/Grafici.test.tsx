import { describe, expect, it, vi } from "vitest";
import server from "../ServerMock";
import { HttpResponse, http } from "msw";
import { spese, incassi } from "./Portafoglio";
import { render } from "@/setup-test";
import PieChart from "@/components/portafoglio/grafici/piechart";
import { screen, waitFor } from "@testing-library/react";
import { PortafoglioContext } from "@/components/portafoglio/portafoglioPage";
import { debug } from "vitest-preview";
import BarChart from "@/components/portafoglio/grafici/barchart";
import { act } from "react-dom/test-utils";

describe("Grafico Piechart", () => {
  const pieChart = (
    <PortafoglioContext.Provider value={{ state: 0, setState: vi.fn() }}>
      <PieChart />
    </PortafoglioContext.Provider>
  );

  it(
    "dovrebbe ottenere i dati delle spese e mostrarli nel grafico",
    async () => {
      const now = new Date();
      const spesa = spese[0];
      spesa.anno = now.getFullYear();
      server.use(
        http.get("/api/transazioni/spese", () => {
          return HttpResponse.json(
            {
              result: [spesa],
              error: false,
            },
            { status: 200 }
          );
        })
      );
      render(pieChart);

      const totale = await screen.findByText(
        (spesa.totale * -1).toFixed(2).replace(".", ","),
        { exact: false }
      );
      const categoria = screen.getByText(spesa.categoria);
      expect(totale).toBeInTheDocument();
      expect(categoria).toBeInTheDocument();
    },
    { retry: 1 }
  );

  it("dovrebbe mostrare la pagina vuota quando non ci sono spese", async () => {
    server.use(
      http.get("/api/transazioni/spese", () => {
        return HttpResponse.json(
          {
            result: [],
            error: false,
          },
          { status: 200 }
        );
      })
    );
    render(pieChart);
    const nessunDato = await screen.findByText("nessun dato", { exact: false });
    expect(nessunDato).toBeInTheDocument();
  });

  it("dovrebbe mostrare la notifica di errore se l'API fallisce", async () => {
    server.use(
      http.get("/api/transazioni/spese", () => {
        return HttpResponse.json(
          {
            message: "errore api",
            error: true,
          },
          { status: 400 }
        );
      })
    );
    render(pieChart);

    const errore = await screen.findByText("errore api");
    expect(errore).toBeInTheDocument();
  });
});

describe("Grafico Barchart", () => {
  const barChart = (
    <PortafoglioContext.Provider value={{ state: 0, setState: vi.fn() }}>
      <BarChart />
    </PortafoglioContext.Provider>
  );

  it(
    "dovrebbe ottenere i dati degli incassi e mostrarli nel grafico",
    async () => {
      const now = new Date();
      const incasso = incassi[0];
      incasso.anno = now.getFullYear();
      server.use(
        http.get("/api/transazioni/incassi", () => {
          return HttpResponse.json(
            {
              result: [incasso],
              error: false,
            },
            { status: 200 }
          );
        })
      );
      render(barChart);

      const totale = await screen.findByText(
        incasso.totale.toFixed(2).replace(".", ","),
        { exact: false }
      );
      expect(totale).toBeInTheDocument();
    },
    { retry: 1 }
  );

  it("dovrebbe mostrare la pagina vuota quando non ci sono incassi", async () => {
    server.use(
      http.get("/api/transazioni/incassi", () => {
        return HttpResponse.json(
          {
            result: [],
            error: false,
          },
          { status: 200 }
        );
      })
    );
    render(barChart);
    const nessunDato = await screen.findByText("nessun dato", { exact: false });
    expect(nessunDato).toBeInTheDocument();
  });

  it("dovrebbe mostrare la notifica di errore se l'API fallisce", async () => {
    server.use(
      http.get("/api/transazioni/incassi", () => {
        return HttpResponse.json(
          {
            message: "errore api",
            error: true,
          },
          { status: 400 }
        );
      })
    );
    render(barChart);

    const errore = await screen.findByText("errore api");
    expect(errore).toBeInTheDocument();
  });
});
