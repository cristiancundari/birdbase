import RegisterSentPage from "@/app/auth/register/sent/page";
import { screen } from "@testing-library/react";
import { render } from "@/setup-test";

describe("Componente RegisterSent", () => {
  it("dovrebbe mostrare il componente RegisterSent", () => {
    render(<RegisterSentPage />);
    expect(screen.getByText("Registrazione presa in carico")).toBeInTheDocument();
  });
});
