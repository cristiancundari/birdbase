import InfoCovataPage from "@/app/app/covate/[id]/page";
import ImpostazioniPage from "@/app/app/impostazioni/page";
import { prisma } from "@/lib/prisma";
import { render } from "@/setup-test";
import { screen } from "@testing-library/react";
import { describe, expect, Mock, vi } from "vitest";

vi.mock("@/lib/supabase/helper", () => ({ getServerUserProfile: vi.fn().mockResolvedValue({ id: "123" }) }));
vi.mock("@/lib/googleapis", () => ({ checkGoogleToken: vi.fn().mockResolvedValue(true) }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));

describe("Impostazioni page", () => {
  it("Dovrebbe mostrare la pagina impostazioni", async () => {
    render(await ImpostazioniPage());
    expect(screen.getByText("Impostazioni")).toBeInTheDocument();
  });
});
