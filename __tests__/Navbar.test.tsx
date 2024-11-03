// Navbar.test.tsx
import { fireEvent, screen } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useRouter, usePathname } from "next/navigation"; // Importa da next/navigation
import Navbar from "@/components/Navbar";
import { render } from "@/setup-test";

vi.mock("@/providers/SupabaseProvider", () => ({
  useSupabase: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

const mockLogout = vi.fn();
const mockPush = vi.fn();
const mockUser = {
  allevatore: { nome: "Mario", cognome: "Rossi" },
};

describe("Navbar", () => {
  beforeEach(() => {
    (useSupabase as Mock).mockReturnValue({
      user: mockUser,
      client: {
        auth: {
          signOut: mockLogout,
        },
      },
    });
    (useRouter as Mock).mockReturnValue({
      push: mockPush,
    });
    (usePathname as Mock).mockReturnValue("/"); // Mock per usePathname
  });

  it("Mostra la Navbar con i link e le informazioni dell'utente", () => {
    const links = [
      { icon: <div>Icon1</div>, label: "Home", url: "/" },
      { icon: <div>Icon2</div>, label: "Profile", url: "/profile" },
    ];

    render(
      <Navbar links={links}>
        <div>Content</div>
      </Navbar>
    );

    // Controlla che il titolo sia presente
    expect(screen.getByText("BirdBase")).toBeInTheDocument();

    // Controlla che i link siano presenti
    links.forEach((link) => {
      expect(screen.getByText(link.label)).toBeInTheDocument();
    });

    // Controlla che il nome dell'utente sia presente
    expect(screen.getByText("Mario Rossi")).toBeInTheDocument();
  });

  it("chiama la funzione di logout e reindirizza l'utente quando si clicca sull'elemento di logout", async () => {
    const links = [{ icon: <div>Icon1</div>, label: "Home", url: "/" }];

    render(
      <Navbar links={links}>
        <div>Content</div>
      </Navbar>
    );

    // Apri il menu di logout
    fireEvent.click(screen.getByTestId("logout-menu"));

    // Clicca sull'elemento di logout
    fireEvent.click(screen.getByText("Logout"));

    // Verifica che la funzione di logout sia stata chiamata
    expect(mockLogout).toHaveBeenCalled();

    // Controlla che il redirect avvenga
    await new Promise((resolve) => setTimeout(resolve, 0)); // Aspetta che il logout si completi
    expect(mockPush).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/auth/login?callbackUrl=/"); // Controlla il redirect
  });
});
