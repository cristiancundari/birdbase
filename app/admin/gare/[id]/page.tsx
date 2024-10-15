import GaraNonValida from "@/components/GaraNonValida";
import InfoGara from "@/components/gare/id/InfoGara";
import { prisma } from "@/lib/prisma";
import { getServerUserProfile } from "@/lib/supabase/helper";
import { Role } from "@prisma/client";
import assert from "assert";
import { cookies } from "next/headers";

interface InfoGaraPageProps {
  params: {
    id: string;
  };
}
async function DettagliGara({ params }: InfoGaraPageProps) {
  const profile = await getServerUserProfile(cookies());
  assert(profile, "Errore profile non trovato");

  const gara = await prisma.gara.findFirst({
    where: { id: params.id },
    include: { nazione: true, _count: { select: { iscrizioni: true } } },
  });
  if (!gara || profile.ruolo !== Role.ADMIN) {
    return <GaraNonValida />;
  }
  return <InfoGara gara={gara} />;
}

export default DettagliGara;
