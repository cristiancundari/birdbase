import InfoSoggetto from "@/components/home/id/InfoSoggetto";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import { SoggettoWithGara } from "@/types/types";
import { Soggetto } from "@prisma/client";
import assert from "assert";
import { cookies } from "next/headers";
import React from "react";

interface InfoSoggettoProps {
  params: {
    id: string;
  };
}

async function InfoSoggettoPage(props: InfoSoggettoProps) {
  const user = await getServerUser(cookies());
  assert(user);
  const soggetto: SoggettoWithGara | null = await prisma.soggetto.findFirst({
    include: { iscrizioni: { include: { gara: true } } },
    where: {
      id: props.params.id,
      profiloId: user.id,
    },
  });
  if (!soggetto) {
    return <SoggettoNonTrovato />;
  } else {
    return <InfoSoggetto soggetto={soggetto} />;
  }
}

export default InfoSoggettoPage;

function SoggettoNonTrovato() {
  return <div>Errore: soggetto non trovato</div>;
}
