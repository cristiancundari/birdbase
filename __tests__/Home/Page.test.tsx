import AppPage from "@/app/app/page";
import Home from "@/app/page";
import { render } from "@/setup-test";
import { redirect } from "next/navigation";
import { describe, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({ redirect: vi.fn(), RedirectType: { replace: "replace" } }));

describe("Pagina Home", () => {
  it("Dovrebbe effettuare il redirect alla home", () => {
    render(<Home />);
    expect(redirect).toHaveBeenCalledWith("/app/home");
  });

  it("Dovrebbe effettuare il redirect alla home", () => {
    render(<AppPage />);
    expect(redirect).toHaveBeenCalledWith("/app/home", expect.anything());
  });
});
