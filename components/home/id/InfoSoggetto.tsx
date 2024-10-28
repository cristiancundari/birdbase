"use client";
import Breadcrumb from "@/components/Breadcrumb";
import { getIconSesso } from "@/components/IconsSesso";
import InfoGabbia from "@/components/InfoGabbia";
import InfoNazione from "@/components/InfoNazione";
import { apiFetch } from "@/lib/apiFetch";
import {
  formatAnelletto,
  formatData,
  getBucketImgPath,
  showNotification,
} from "@/lib/helper";
import {
  IscrizioniWithGaraWithNazione,
  SoggettoWithIscrizioniWithGaraWithNazione,
  SoggettoWithParentela,
} from "@/types/types";
import {
  Avatar,
  Button,
  Card,
  Center,
  Fieldset,
  Group,
  Loader,
  Pill,
  Stack,
  Text,
} from "@mantine/core";
import { Soggetto } from "@prisma/client";
import { IconPrinter } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const breadcrumbsItems = [
  { title: "Home", href: "/app/home" },
  { title: "Info soggetto", href: "#" },
];

function InfoSoggetto({
  soggetto,
}: {
  soggetto: SoggettoWithIscrizioniWithGaraWithNazione;
}) {
  const [listaParenti, setListaParenti] = useState<Map<string, Soggetto[]>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(true);
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  async function getParentele() {
    setIsLoading(true);

    const response = await apiFetch.get<SoggettoWithParentela[]>(
      `/api/covate/parentele?soggetto=${soggetto.id}`
    );
    if (response.error) {
      setIsLoading(false);
      return showNotification({ message: response.message });
    }

    setListaParenti(calcolaListaParenti(response.data));

    setIsLoading(false);
  }

  function calcolaListaParenti(parentele: SoggettoWithParentela[]) {
    const parenti = new Map<string, Soggetto[]>();
    parentele.forEach((p) => {
      const soggetti = parenti.get(p.parentela!.plurale);
      if (soggetti) {
        soggetti.push(p.soggetto);
      } else {
        parenti.set(p.parentela!.plurale, [p.soggetto]);
      }
    });

    parenti.forEach((soggetti) => {
      soggetti.sort((a, b) => {
        if (a.sesso === b.sesso) {
          return a.dataNascita.getTime() - b.dataNascita.getTime();
        }
        return a.sesso ? -1 : 1;
      });
    });

    return parenti;
  }

  useEffect(() => {
    getParentele();
  }, []);

  return (
    <>
      <Group my={"md"} justify="space-between">
        <Breadcrumb items={breadcrumbsItems} />
        <Button
          onClick={handlePrint}
          variant="light"
          leftSection={<IconPrinter size={14} />}
        >
          Stampa
        </Button>
      </Group>
      <Card radius={"lg"} ref={componentRef}>
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
            <InfoGabbia gabbia={soggetto.gabbia} />
            <Text>Data di nascita: {formatData(soggetto.dataNascita)}</Text>
          </Group>
          {soggetto.note && <Text mt="md">Note: {soggetto.note}</Text>}
        </Fieldset>
        <Fieldset legend="Informazioni Parentele" mb="md">
          {isLoading ? (
            <Center p="lg">
              <Loader size="sm" />
            </Center>
          ) : (
            listaParenti.size === 0 && <Center>Nessun parente</Center>
          )}
          <Stack>
            {Array.from(listaParenti.entries()).map(([parentela, soggetti]) => (
              <Stack gap={"xs"} key={parentela}>
                <Text fw={700}>{parentela}</Text>
                <Group>
                  {soggetti.map((s) => (
                    <Link key={s.id} href={`/app/home/${s.id}`}>
                      <Pill>
                        <Group gap="xs" wrap="nowrap">
                          {getIconSesso(s.sesso, 14)}
                          {formatAnelletto(s.rna, s.numero, s.anno)}
                        </Group>
                      </Pill>
                    </Link>
                  ))}
                </Group>
              </Stack>
            ))}
          </Stack>
        </Fieldset>
        <Dossier iscrizioni={soggetto.iscrizioni} />
      </Card>
    </>
  );
}

export const Dossier = ({
  iscrizioni,
}: {
  iscrizioni: IscrizioniWithGaraWithNazione[];
}) => {
  return (
    <Fieldset legend="Dossier Gare" mb="md">
      {iscrizioni.length === 0 && <Center>Nessuna iscrizione a gare</Center>}
      <Stack>
        {iscrizioni.map((iscrizione) => (
          <Stack gap="xs" key={iscrizione.id}>
            <Group justify="space-between" align="end">
              <Stack gap={3}>
                <Text fw={700}>{iscrizione.gara.titolo}</Text>
                <Text size="sm">Data: {formatData(iscrizione.gara.data)}</Text>
                <Group gap="xs">
                  <Text size="xs" c="dimmed">
                    {iscrizione.gara.citta}
                  </Text>
                  <InfoNazione
                    nazione={iscrizione.gara.nazione}
                    flagSize="sm"
                  />
                </Group>
              </Stack>
              <Stack gap={3}>
                <Text>Voto: {iscrizione.voto}/100</Text>
                <Group gap="xs">
                  <Text size="lg" span>
                    {iscrizione.posizione + "°"}
                  </Text>
                  <Text c="dimmed" span>
                    {"classificato"}
                  </Text>
                </Group>
              </Stack>
            </Group>
          </Stack>
        ))}
      </Stack>
    </Fieldset>
  );
};

export default InfoSoggetto;
