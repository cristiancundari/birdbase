import InfoSoggetto, { Dossier } from "@/components/home/id/InfoSoggetto";
import { getIconSesso } from "@/components/IconsSesso";
import InfoGabbia from "@/components/InfoGabbia";
import { formatAnelletto, formatData, getBucketImgPath } from "@/lib/helper";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import { Avatar, Card, Fieldset, Group, Text } from "@mantine/core";
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
    },
  });
  if (!soggetto) {
    return <SoggettoNonTrovato />;
  } else if (soggetto.profiloId === user.id) {
    return <InfoSoggetto soggetto={soggetto} />;
  } else {
    return (
      <Card>
        <Group justify="center" p="md">
          <Avatar
            data-testid="ImgAvatar"
            variant="filled"
            size="xl"
            src={
              soggetto.avatar
                ? getBucketImgPath("img", soggetto.avatar)
                : `https://images.placeholders.dev/?width=50&height=50&textWrap=true&text=${formatAnelletto(
                    soggetto.rna,
                    soggetto.numero,
                    soggetto.anno
                  )}`
            }
          />
        </Group>
        <Fieldset legend="Informazioni Soggetto" mb="md">
          <Group justify="space-between">
            <Text fw={500}>
              {formatAnelletto(soggetto.rna, soggetto.numero, soggetto.anno)}
            </Text>
            <Group gap="0">
              Sesso:
              {getIconSesso(soggetto.sesso)}
            </Group>
            <Text>Data di nascita: {formatData(soggetto.dataNascita)}</Text>
          </Group>
        </Fieldset>
        <Dossier iscrizioni={soggetto.iscrizioni} />
      </Card>
    );
  }
}

export default InfoSoggettoPage;

function SoggettoNonTrovato() {
  return <div>Errore: soggetto non trovato</div>;
}
