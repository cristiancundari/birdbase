import Slider from "@/components/Slider";
import { render } from "@/setup-test";
import { screen } from "@testing-library/react";
import { describe } from "vitest";

describe("Componente Slider", () => {
  it("Dovrebbe renderizzare il componente", async () => {
    render(<Slider value={0.8} onChange={() => {}} />);
    expect(screen.getByText("80 %")).toBeInTheDocument();
  });
});
