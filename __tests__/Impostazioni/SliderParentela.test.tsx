import SliderParentela from "@/components/impostazioni/SliderParentela";
import { apiFetch } from "@/lib/apiFetch";
import { render } from "@/setup-test";
import { fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";

describe("Componente SliderParentela", () => {
  vi.mock("@/lib/apiFetch", () => ({
    apiFetch: {
      put: vi.fn().mockResolvedValue({
        error: false,
        data: {},
      }),
    },
  }));

  it("Dovrebbe renderizzare il componente", () => {
    render(<SliderParentela limiteLivelliParentela={5} />);
    expect(screen.getByText("Limite grado di parentela")).toBeInTheDocument();
  });

  it("Dovrebbe effettuare il salvataggio del dato", () => {
    const limiteLivelliParentela = 5;
    render(<SliderParentela limiteLivelliParentela={limiteLivelliParentela} />);
    const btnSalva = screen.getByText("Salva");
    expect(btnSalva).toBeInTheDocument();
    fireEvent.click(btnSalva);
    expect(apiFetch.put).toHaveBeenCalledWith("/api/impostazioni", {
      limiteLivelliParentela: limiteLivelliParentela,
    });
  });
});
