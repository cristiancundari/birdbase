import InfoSoggetto from "@/components/home/id/InfoSoggetto";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import assert from "assert";
import { cookies } from "next/headers";

interface InfoSoggettoProps {
  params: {
    id: string;
  };
}

async function InfoSoggettoPage(props: InfoSoggettoProps) {
  const user = await getServerUser(cookies());
  assert(user);
  const soggetto = await prisma.soggetto.findUnique({
    include: {
      iscrizioni: {
        where: { voto: { not: null }, posizione: { not: null } },
        orderBy: { gara: { data: "desc" } },
        include: {
          gara: {
            include: { nazione: true },
          },
        },
      },
    },
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
