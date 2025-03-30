import GoogleCalendarLink from "@/components/impostazioni/GoogleCalendarLink";
import { render } from "@/setup-test";
import { screen } from "@testing-library/react";
import { describe, it } from "vitest";
import { debug } from "vitest-preview";

describe("Componente GoogleCalendarLink", () => {
  it("Dovrebbe renderizzare il componente", () => {
    render(<GoogleCalendarLink disabled={false} />);
    expect(screen.getByText("Collega Google Calendar")).toBeInTheDocument();
  });

  it("Dovrebbe renderizzare il pulsante disabilitato", () => {
    render(<GoogleCalendarLink disabled={true} />);
    expect(screen.getByText("Collega Google Calendar")).toBeInTheDocument();

    const btn = screen.getByRole("link", { name: "Collega Google Calendar" });
    expect(btn).toHaveAttribute("data-disabled", "true");
  });
});
