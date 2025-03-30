import GaraNonValida from "@/components/GaraNonValida";
import InfoGara from "@/components/gare/id/InfoGara";
import { prisma } from "@/lib/prisma";
import { getServerUser, getServerUserProfile } from "@/lib/supabase/helper";
import { Box } from "@mantine/core";
import { Role } from "@prisma/client";
import assert from "assert";
import { cookies } from "next/headers";
import React from "react";

interface InfoGaraPageProps {
  params: {
    id: string;
  };
}

async function IscrizioneGara({ params }: InfoGaraPageProps) {
  const profile = await getServerUserProfile(cookies());
  assert(profile);

  const gara = await prisma.gara.findFirst({
    where: { id: params.id },
    include: { nazione: true, _count: { select: { iscrizioni: true } } },
  });

  if (!gara || (profile.ruolo !== Role.ADMIN && gara.isDeleted)) {
    return <GaraNonValida />;
  }
  return (
    <Box data-testid="info_gara">
      <InfoGara gara={gara} />;
    </Box>
  );
}

export default IscrizioneGara;
