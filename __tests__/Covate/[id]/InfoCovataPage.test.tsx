import InfoCovataPage from "@/app/app/covate/[id]/page";
import { prisma } from "@/lib/prisma";
import { render } from "@/setup-test";
import { screen } from "@testing-library/react";
import { describe, expect, Mock, vi } from "vitest";

vi.mock("@/lib/supabase/helper", () => ({ getServerUser: vi.fn().mockResolvedValue({ id: "123" }) }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { covata: { findFirst: vi.fn() } } }));
vi.mock("next/navigation", () => ({ useRouter: vi.fn() }));

describe("Info Covata page", () => {
  it("Dovrebbe mostrare un messaggio di errore nel caso in cui non trova una covata", async () => {
    render(await InfoCovataPage({ params: { id: "" } }));
    expect(screen.getByText("Errore: covata non trovata")).toBeInTheDocument();
  });

  it("Dovrebbe mostrare il componente InfoCovata", async () => {
    (prisma.covata.findFirst as Mock).mockResolvedValue({
      figli: [],
      padre: { rna: "padre", numero: "1", anno: "2000" },
      madre: { rna: "madre", numero: "2", anno: "2000" },
    });
    render(await InfoCovataPage({ params: { id: "" } }));

    expect(screen.getByTestId("info_covata")).toBeInTheDocument();
  });
});
