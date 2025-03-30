import HomeAdminPage from "@/app/admin/home/page";
import { render } from "@/setup-test";
import { screen } from "@testing-library/react";
import { describe } from "vitest";

describe("Home Admin Page", () => {
  it("Dovrebbe visualizzare la Home page dell'admin", () => {
    render(<HomeAdminPage />);
    expect(screen.getByText("HomePage"));
  });
});
