import GareAdminPage from "@/app/admin/gare/page";
import MarketplacePage from "@/app/app/marketplace/page";
import Home from "@/app/page";
import { render } from "@/setup-test";
import { screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import { describe, vi } from "vitest";

vi.mock("@/providers/SupabaseProvider", () => ({ useSupabase: vi.fn().mockReturnValue({ user: "" }) }));
vi.mock("@/app/api/inserzioni/actions", () => ({ getInserzioni: vi.fn().mockResolvedValue([]) }));
vi.mock("next/navigation", () => ({ useRouter: vi.fn() }));

describe("Marketplace Page", () => {
  it("Dovrebbe visualizzare la pagina Marketplace", async () => {
    render(await MarketplacePage());
    expect(screen.getByText("Nessuna inserzione"));
  });
});
