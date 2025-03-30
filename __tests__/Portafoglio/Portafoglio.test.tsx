import Portafoglio from "@/app/app/portafoglio/page";
import { render } from "@/setup-test";
import { screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({ useRouter: vi.fn().mockReturnValue({ router: "" }) }));

describe("Portafoglio", () => {
  it("Dovrebbe renderizzare la pagina Portafoglio", async () => {
    render(await Portafoglio());
    expect(screen.getByText("Genera Report")).toBeInTheDocument();
  });
});
