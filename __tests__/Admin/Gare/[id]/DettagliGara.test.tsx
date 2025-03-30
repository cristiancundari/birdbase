import DettagliGara from "@/app/admin/gare/[id]/page";
import { prisma } from "@/lib/prisma";
import { getServerUserProfile } from "@/lib/supabase/helper";
import { useSupabase } from "@/providers/SupabaseProvider";
import { render } from "@/setup-test";
import { Role } from "@prisma/client";
import { screen } from "@testing-library/react";
import { describe, expect, Mock, vi } from "vitest";

vi.mock("@/lib/supabase/helper", () => ({ getServerUserProfile: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { gara: { findFirst: vi.fn() } },
}));
vi.mock("@/providers/SupabaseProvider", () => ({
  useSupabase: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("Pagina dettagli gara ADMIN", () => {
  beforeEach(() => {
    (getServerUserProfile as Mock).mockResolvedValue({ id: "123", ruolo: Role.ADMIN });
    (prisma.gara.findFirst as Mock).mockResolvedValue({ _count: { iscrizioni: 123 }, nazione: { sigla: "it" } });
    (useSupabase as Mock).mockResolvedValue({
      user: { ruolo: Role.ADMIN },
    });
  });

  it("Dovrebbe renderizzare la pagina con le informazioni sulla gara", async () => {
    render(await DettagliGara({ params: { id: "111" } }));
    expect(screen.getByTestId("infoGara")).toBeInTheDocument();
  });

  it("Dovrebbe mostrare il componente GaraNonValida se la gara non viene trovata", async () => {
    (prisma.gara.findFirst as Mock).mockResolvedValue(undefined);
    render(await DettagliGara({ params: { id: "111" } }));
    expect(screen.getByText("Gara non trovata")).toBeInTheDocument();
  });

  it("Dovrebbe mostrare il componente GaraNonValida se l'utente non è un ADMIN", async () => {
    (getServerUserProfile as Mock).mockResolvedValue({ user: { id: "123", ruolo: Role.USER } });
    render(await DettagliGara({ params: { id: "111" } }));
    expect(screen.getByText("Gara non trovata")).toBeInTheDocument();
  });
});
