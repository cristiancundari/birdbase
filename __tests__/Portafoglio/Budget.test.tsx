import Budget from "@/components/portafoglio/budget";
import { PortafoglioContext } from "@/components/portafoglio/portafoglioPage";
import { render } from "@/setup-test";
import { Profilo } from "@prisma/client";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it, vi } from "vitest";
import server from "../ServerMock";
import { budget } from "./Portafoglio";

describe("<Budget />", () => {
  const BudgetComp = (
    <PortafoglioContext.Provider value={{ state: 0, setState: vi.fn() }}>
      <Budget />
    </PortafoglioContext.Provider>
  );

  it("dovrebbe visualizzare il budget dell'utente", async () => {
    server.use(
      http.get("/api/budget", () => {
        return HttpResponse.json(
          { result: budget, error: false },
          { status: 200 }
        );
      })
    );

    render(BudgetComp);
    const budgetText = await screen.findByText(
      budget.budget.budget.toFixed(2).replace(".", ","),
      { exact: false }
    );
    expect(budgetText).toBeInTheDocument();
  });

  it("dovrebbe visualizzare il bilancio (budget - spese del mese in corso)", async () => {
    server.use(
      http.get("/api/budget", () => {
        return HttpResponse.json(
          { result: budget, error: false },
          { status: 200 }
        );
      })
    );

    render(BudgetComp);
    const bilancio = budget.budget.budget + (budget.spese._sum.prezzo || 0);
    const bilancioText = await screen.findByText(
      bilancio.toFixed(2).replace(".", ","),
      { exact: false }
    );
    expect(bilancioText).toBeInTheDocument();
  });

  it("dovrebbe visualizzare un input per modificare il budget quando si attiva la modalità di modifica", async () => {
    server.use(
      http.get("/api/budget", () => {
        return HttpResponse.json(
          { result: budget, error: false },
          { status: 200 }
        );
      })
    );
    render(BudgetComp);
    const skeletonBudget = screen.getByTestId("SkeletonBudget");
    await waitFor(() => expect(skeletonBudget).not.toBeInTheDocument());

    const buttonModificaBudget = screen.getByTestId("ButtonModificaBudget");
    const inputBudgetBefore = screen.queryByTestId("InputBudget");
    expect(inputBudgetBefore).not.toBeInTheDocument();
    fireEvent.click(buttonModificaBudget);
    const inputBudgetAfter = screen.getByTestId("InputBudget");
    expect(inputBudgetAfter).toBeInTheDocument();
    expect(inputBudgetAfter).toHaveValue(budget.budget.budget.toFixed(2));
  });

  it("dovrebbe salvare una modifica al budget", async () => {
    const profilo: Profilo = {
      id: "userid",
      name: "user",
      budget: 199,
      ruolo: "USER",
    };

    server.use(
      http.get("/api/budget", () => {
        return HttpResponse.json(
          { result: budget, error: false },
          { status: 200 }
        );
      }),
      http.patch("/api/budget", () => {
        return HttpResponse.json(
          { result: profilo, error: false },
          { status: 200 }
        );
      })
    );
    render(BudgetComp);
    const skeletonBudget = screen.getByTestId("SkeletonBudget");
    await waitFor(() => expect(skeletonBudget).not.toBeInTheDocument());

    const buttonModificaBudget = screen.getByTestId("ButtonModificaBudget");
    const inputBudgetBefore = screen.queryByTestId("InputBudget");
    expect(inputBudgetBefore).not.toBeInTheDocument();
    fireEvent.click(buttonModificaBudget);
    const inputBudgetAfter = screen.getByTestId("InputBudget");
    expect(inputBudgetAfter).toBeInTheDocument();
    expect(inputBudgetAfter).toHaveValue(budget.budget.budget.toFixed(2));
    fireEvent.input(inputBudgetAfter, { target: { value: profilo.budget } });
    const buttonSalva = screen.getByTestId("ButtonSalva");

    const getBudget = vi.fn();
    server.use(http.get("/api/budget", getBudget));

    fireEvent.click(buttonSalva);
    const notification = await screen.findByText("correttamente", {
      exact: false,
    });
    expect(notification).toBeInTheDocument();
    expect(getBudget).toBeCalled();
  });
});
