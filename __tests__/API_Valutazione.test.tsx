import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/valutazioni/route"; // Aggiorna con il path reale
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

// Mocks
import * as evaluator from "@/lib/parser/evaluator";
import * as prismaClient from "@/lib/prisma";
import * as auth from "@/lib/supabase/helper";
import * as parentele from "@/app/api/covate/parentele/checkParentele";
import { mockProfilo } from "./Profilo";
import { soggetti } from "./Soggetti/Soggetti";
import { mockGara } from "./Gare/Gara";
import {
  SoggettoWithVendite,
  SoggettoWithVenditeWithParentela,
} from "@/types/types";
import { Inserzione, Soggetto } from "@prisma/client";

// Mocks dei moduli
vi.mock("@/lib/prisma", () => ({
  prisma: {
    soggetto: { findMany: vi.fn() },
    iscrizione: { findMany: vi.fn() },
  },
}));
vi.mock("@/lib/supabase/helper", () => ({ getServerUserProfile: vi.fn() }));
vi.mock("next/headers", () => ({
  cookies: () => ({
    get: vi.fn(),
  }),
}));

describe("GET /api/valutazioni", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("calcola correttamente le valutazioni di due voti distanti un anno", async () => {
    const now = new Date();
    const unAnnoFa = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate()
    );

    // USER MOCK
    const mockUser = {
      ...mockProfilo,
      formulaData: "1 - 0.8 * x",
    };
    vi.spyOn(auth, "getServerUserProfile").mockResolvedValue(mockUser);

    // SOGGETTI
    const mockSoggetti = soggetti.map((s) => ({
      ...s,
      covata: null,
      inserzioniVendita: [],
    }));
    vi.spyOn(prismaClient.prisma.soggetto, "findMany").mockResolvedValue(
      mockSoggetti
    );

    // GARE
    const mockIscrizioni = [
      {
        id: "iscrizione-1",
        profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
        garaId: mockGara.id,
        soggettoId: mockSoggetti[0].id,
        createdAt: new Date(),
        importo: 5,
        posizione: 1,
        voto: 80,
        gara: {
          ...mockGara,
          data: now,
        },
      },
      {
        id: "iscrizione-2",
        profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
        garaId: mockGara.id,
        soggettoId: mockSoggetti[0].id,
        createdAt: new Date(),
        importo: 5,
        posizione: 1,
        voto: 100,
        gara: {
          ...mockGara,
          data: unAnnoFa,
        },
      },
    ];
    vi.spyOn(prismaClient.prisma.iscrizione, "findMany").mockResolvedValue(
      mockIscrizioni
    );

    // CHIAMATA
    const mockRequest = {} as NextRequest;
    const response = await GET(mockRequest);
    const json = await response.json();

    // ASSERT
    expect(response.status).toBe(200);
    expect(json.error).toBe(false);
    expect(json.result).toBeDefined();
    expect(json.result[mockSoggetti[0].id]).toBeLessThan(90);
  });

  it("calcola correttamente le valutazioni di due voti tra genitore e figlio", async () => {
    const now = new Date();

    // USER MOCK
    const mockUser = {
      ...mockProfilo,
      formulaParentela: "1 - 0.8 * x",
    };
    vi.spyOn(auth, "getServerUserProfile").mockResolvedValue(mockUser);

    // SOGGETTI
    const mockSoggetti: (Soggetto & {
      covata: { idMadre: string; idPadre: string } | null;
      inserzioniVendita: Inserzione[];
    })[] = soggetti.map((s) => ({
      ...s,
      covata: null,
      inserzioniVendita: [],
    }));
    mockSoggetti[0].covata = {
      idPadre: soggetti[1].id,
      idMadre: soggetti[2].id,
    };
    vi.spyOn(prismaClient.prisma.soggetto, "findMany").mockResolvedValue(
      mockSoggetti
    );

    // GARE
    const mockIscrizioni = [
      {
        id: "iscrizione-1",
        profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
        garaId: mockGara.id,
        soggettoId: mockSoggetti[0].id,
        createdAt: new Date(),
        importo: 5,
        posizione: 1,
        voto: 80,
        gara: {
          ...mockGara,
          data: now,
        },
      },
      {
        id: "iscrizione-2",
        profiloId: "318d0e65-0b13-4b3b-92c8-af2895a7e79b",
        garaId: mockGara.id,
        soggettoId: mockSoggetti[1].id,
        createdAt: new Date(),
        importo: 5,
        posizione: 1,
        voto: 100,
        gara: {
          ...mockGara,
          data: now,
        },
      },
    ];
    vi.spyOn(prismaClient.prisma.iscrizione, "findMany").mockResolvedValue(
      mockIscrizioni
    );

    // CHIAMATA
    const mockRequest = {} as NextRequest;
    const response = await GET(mockRequest);
    const json = await response.json();

    // ASSERT
    expect(response.status).toBe(200);
    expect(json.error).toBe(false);
    expect(json.result).toBeDefined();
    expect(json.result[mockSoggetti[0].id]).toBeLessThan(90);
  });
});
