import { screen, fireEvent, waitFor } from "@testing-library/react";
import { redirect, RedirectType, useRouter } from "next/navigation";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Mock, vi } from "vitest";
import Login from "@/components/login/Login";
import { render } from "@/setup-test";
import { createClient } from "@/lib/supabase/server";
import LoginPage from "@/app/auth/login/page";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  RedirectType: { replace: "replace" },
  useRouter: vi.fn(),
  useSearchParams: () => ({
    get: vi.fn(() => null), // Mock del parametro di ricerca
  }),
}));

vi.mock("@/providers/SupabaseProvider", () => ({
  useSupabase: vi.fn(),
}));

const mockSupabase = {
  client: {
    auth: {
      signInWithPassword: vi.fn(),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  },
};

describe("Pagina Login", () => {
  it("deve fare il redirect all'URL di callback o alla home se l'utente è già loggato", async () => {
    const mockSupabase = {
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: { user: { id: "user-123" } } },
        }),
      },
    };

    (createClient as Mock).mockReturnValue(mockSupabase);

    render(await LoginPage({ searchParams: { callbackUrl: "/dashboard" } }));

    expect(redirect).toHaveBeenCalledWith("/dashboard", expect.anything());
  });

  it("deve fare il redirect alla /app/home se non viene fornito un URL di callback e l'utente è loggato", async () => {
    const mockSupabase = {
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: { user: { id: "user-123" } } },
        }),
      },
    };

    (createClient as Mock).mockReturnValue(mockSupabase);

    render(await LoginPage({ searchParams: { callbackUrl: "" } }));

    expect(redirect).toHaveBeenCalledWith("/app/home", expect.anything());
  });

  it("deve renderizzare il componente Login se l'utente non è loggato", async () => {
    const mockSupabase = {
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: null },
        }),
      },
    };

    (createClient as Mock).mockReturnValue(mockSupabase);

    render(await LoginPage({ searchParams: { callbackUrl: "/dashboard" } }));

    expect(screen.getByRole("button", { name: /accedi/i })).toBeInTheDocument();
  });
});

describe("Componente Login", () => {
  let router;

  beforeEach(() => {
    router = {
      push: vi.fn(),
      refresh: vi.fn(),
    };
    (useRouter as Mock).mockReturnValue(router);
    (useSupabase as Mock).mockReturnValue(mockSupabase);
    mockSupabase.client.auth.signInWithPassword.mockReset();
    mockSupabase.client.from.mockReset();
    mockSupabase.client.eq.mockReset();
  });

  it("dovrebbe renderizzare correttamente il componente", () => {
    render(<Login />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /accedi/i })).toBeInTheDocument();
  });

  it("dovrebbe visualizzare un messaggio di errore in caso di login fallito", async () => {
    mockSupabase.client.auth.signInWithPassword.mockResolvedValue({
      error: { message: "Credenziali non valide" },
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "nonvalido@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "passwordsbagliata" },
    });
    fireEvent.click(screen.getByRole("button", { name: /accedi/i }));

    await waitFor(() => {
      expect(screen.getByText(/si è verificato un errore/i)).toBeInTheDocument();
      expect(screen.getByText(/se non ricordi le credenziali/i)).toBeInTheDocument();
    });
  });

  it("dovrebbe reindirizzare alla home dell'utente in caso di login riuscito", async () => {
    mockSupabase.client.auth.signInWithPassword.mockResolvedValue({
      error: null,
      data: { user: { id: "id-utente" } },
    });
    mockSupabase.client.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null }), //Quando viene effettuata la query per verificare se l'utente è un admin ritorna null (non è un admin)
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "utente@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "passwordcorretta" },
    });
    fireEvent.click(screen.getByRole("button", { name: /accedi/i }));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/app/home");
    });
  });

  it("dovrebbe reindirizzare alla home dell'amministratore in caso di login riuscito per amministratori", async () => {
    mockSupabase.client.auth.signInWithPassword.mockResolvedValue({
      error: null,
      data: { user: { id: "id-admin" } },
    });
    mockSupabase.client.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: "id-admin" } }), //Quando viene effettuata la query per verificare se l'utente è un admin ritorna un oggetto (è un admin)
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "passwordadmin" },
    });
    fireEvent.click(screen.getByRole("button", { name: /accedi/i }));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/admin/home");
    });
  });
});
