import Covate from "@/app/app/covate/page";
import { render } from "@/setup-test";
import { screen } from "@testing-library/react";
import { describe, vi } from "vitest";

vi.mock("@/providers/SupabaseProvider", () => ({ useSupabase: vi.fn().mockReturnValue({ user: "" }) }));

describe("Covate Page", () => {
  it("Dovrebbe visualizzare il componente GaraPage", () => {
    render(<Covate />);
    expect(screen.getByTestId("covate"));
  });
});
