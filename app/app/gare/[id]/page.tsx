import InfoGara from "@/components/gare/InfoGara";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import { GaraWithNazioneAndCountIscrizioni } from "@/types/types";
import assert from "assert";
import { cookies } from "next/headers";
import React from "react";

interface InfoGaraPageProps {
  params: {
    id: string;
  };
}

async function IscrizioneGara({ params }: InfoGaraPageProps) {
  const user = await getServerUser(cookies());
  assert(user);
  const gara = await prisma.gara.findFirst({
    where: { id: params.id },
    include: { nazione: true, _count: { select: { iscrizioni: true } } },
  });
  if (!gara) {
    return <GaraNonValida />;
  }
  return <InfoGara gara={gara} />;
}

export default IscrizioneGara;

function GaraNonValida() {
  return <div>Gara non trovata</div>;
}
