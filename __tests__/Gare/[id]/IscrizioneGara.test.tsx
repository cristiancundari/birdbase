import InfoCovataPage from "@/app/app/covate/[id]/page";
import IscrizioneGara from "@/app/app/gare/[id]/page";
import { prisma } from "@/lib/prisma";
import { render } from "@/setup-test";
import { screen } from "@testing-library/react";
import { describe, expect, Mock, vi } from "vitest";

vi.mock("@/lib/supabase/helper", () => ({ getServerUserProfile: vi.fn().mockResolvedValue({ id: "123" }) }));
vi.mock("@/providers/SupabaseProvider", () => ({ useSupabase: vi.fn().mockResolvedValue({ id: "123" }) }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { gara: { findFirst: vi.fn() } } }));
vi.mock("next/navigation", () => ({ useRouter: vi.fn() }));

describe("Iscrizione Gara", () => {
  it("Dovrebbe mostrare un messaggio di errore nel caso in cui non trova una gara", async () => {
    render(await IscrizioneGara({ params: { id: "" } }));
    expect(screen.getByText("Gara non trovata")).toBeInTheDocument();
  });

  it("Dovrebbe mostrare il componente InfoGara", async () => {
    (prisma.gara.findFirst as Mock).mockResolvedValue({ _count: { iscrizioni: 123 }, nazione: { sigla: "it" } });
    render(await IscrizioneGara({ params: { id: "" } }));

    expect(screen.getByTestId("info_gara")).toBeInTheDocument();
  });
});
