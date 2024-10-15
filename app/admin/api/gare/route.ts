import { prisma } from "@/lib/prisma";
import { getServerUserProfile } from "@/lib/supabase/helper";
import { Role } from "@prisma/client";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(request: NextRequest) {
  const datiSchema = z.object({
    setCompletata: z.boolean(),
    garaId: z.string(),
    voti: z.array(
      z.object({
        id: z.string(),
        voto: z.coerce.number(),
      })
    ),
  });
  function checkPosizione(voto: number | null) {
    if (voto === null) {
      return null;
    }
    if (voto >= 95 && voto <= 100) return 1;
    if (voto >= 85 && voto < 95) return 2;
    if (voto >= 75 && voto < 85) return 3;
    return null;
  }
  try {
    const cookieStore = cookies();
    const userProfile = await getServerUserProfile(cookieStore);
    assert(userProfile, "Non autorizzato");

    if (userProfile?.ruolo !== Role.ADMIN) {
      throw new Error("Non autorizzato");
    }
    const dati = await request.json();
    const datiValidate = datiSchema.parse(dati);

    const updatePromises = datiValidate.voti.map((d) => {
      const posizione = checkPosizione(d.voto);
      return prisma.iscrizione.update({
        where: { id: d.id },
        data: { voto: d.voto, posizione: posizione },
      });
    });

    const queryGaraCompletata = [];

    if (datiValidate.setCompletata) {
      queryGaraCompletata.push(
        prisma.gara.update({
          where: { id: datiValidate.garaId },
          data: { stato: "COMPLETATA" },
        })
      );
    }

    const result = await prisma.$transaction([
      ...updatePromises,
      ...queryGaraCompletata,
    ]);
    return NextResponse.json({ error: false, data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: true, message: "Errore nell'inserimento dei voti" },
      { status: 500 }
    );
  }
}
