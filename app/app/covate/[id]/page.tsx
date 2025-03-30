import InfoCovata from "@/components/covate/id/infoCovata";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import { Box } from "@mantine/core";
import assert from "assert";
import { cookies } from "next/headers";
import React from "react";

interface InfoCovataPageProps {
  params: {
    id: string;
  };
}
async function InfoCovataPage(props: InfoCovataPageProps) {
  const user = await getServerUser(cookies());
  assert(user);
  const covata = await prisma.covata.findFirst({
    where: { id: Number(props.params.id), profiloId: user.id },
    include: {
      madre: true,
      padre: true,
      figli: {
        where: {
          profiloId: user.id,
        },
        include: {
          inserzioniVendita: {
            where: {
              NOT: {
                soggettoCopiaId: null,
              },
            },
          },
        },
      },
    },
  });
  if (!covata) {
    return <CovataNonValida />;
  }
  return (
    <Box data-testid="info_covata">
      <InfoCovata covata={covata} />;
    </Box>
  );
}

export default InfoCovataPage;

function CovataNonValida() {
  //TODO: Personalizzare
  return <div>Errore: covata non trovata</div>;
}
