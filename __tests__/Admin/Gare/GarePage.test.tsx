import GareAdminPage from "@/app/admin/gare/page";
import Home from "@/app/page";
import { render } from "@/setup-test";
import { screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import { describe, vi } from "vitest";

vi.mock("@/providers/SupabaseProvider", () => ({ useSupabase: vi.fn().mockReturnValue({ user: "" }) }));

describe("Gare admin page", () => {
  it("Dovrebbe visualizzare il componente GaraPage", () => {
    render(<GareAdminPage />);
    expect(screen.getByTestId("gara_page"));
  });
});
