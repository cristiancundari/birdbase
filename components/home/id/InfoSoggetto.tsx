"use client";
import Breadcrumb from "@/components/Breadcrumb";
import { IconSessoFemale, IconSessoMale } from "@/components/IconsSesso";
import InfoGabbia from "@/components/InfoGabbia";
import { formatAnelletto, formatData, imgPath } from "@/lib/helper";
import { SoggettoWithGara } from "@/types/types";
import {
  Text,
  Card,
  Group,
  Box,
  Avatar,
  Fieldset,
  Stack,
  Button,
} from "@mantine/core";
import { Soggetto } from "@prisma/client";
import {
  IconBarrel,
  IconGenderFemale,
  IconGenderMale,
  IconPrinter,
} from "@tabler/icons-react";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const breadcrumbsItems = [
  { title: "Home", href: "/app/home" },
  { title: "Info soggetto", href: "#" },
];

function InfoSoggetto({ soggetto }: { soggetto: SoggettoWithGara }) {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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
                ? imgPath + soggetto.avatar
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
              {soggetto.sesso ? <IconSessoMale /> : <IconSessoFemale />}
            </Group>
            <InfoGabbia gabbia={soggetto.gabbia} />
            <Text>Data di nascita: {formatData(soggetto.dataNascita)}</Text>
          </Group>
          {soggetto.note && <Text mt="md">Note: {soggetto.note}</Text>}
        </Fieldset>
        <Fieldset legend="Informazioni Parentele" mb="md">
          <Text>Padre: </Text>
          <Text>Madre: </Text>
          <Text>Fratelli: </Text>
        </Fieldset>
        <Fieldset legend="Dossier Gare" mb="md">
          <Stack gap={"xs"} my={"xl"}>
            <Group justify="space-between">
              <Text fw={700}>{}</Text>
              <Text>Anno:2024</Text>
            </Group>
            <Group justify="space-between">
              <Text>voto: 87/100</Text>
              <Group gap="0">
                <Text size="xl">🥈</Text>
                <Text c="dimmed">classificato</Text>
              </Group>
            </Group>
          </Stack>

          <Stack gap={"xs"} my={"xl"}>
            <Group justify="space-between">
              <Text fw={700}>Campionato mondiale 🇮🇹</Text>
              <Text>Anno:2023</Text>
            </Group>
            <Group justify="space-between">
              <Text>voto: 100/100</Text>
              <Group gap="0">
                <Text size="xl">🥇</Text>
                <Text c="dimmed">classificato</Text>
              </Group>
            </Group>
          </Stack>

          <Stack gap={"xs"} my={"xl"}>
            <Group justify="space-between">
              <Text fw={700}>Campionato mondiale 🇩🇪</Text>
              <Text>Anno:2022</Text>
            </Group>
            <Group justify="space-between">
              <Text>voto: 75/100</Text>
              <Group gap="0">
                <Text size="xl">🥉</Text>
                <Text c="dimmed">classificato</Text>
              </Group>
            </Group>
          </Stack>

          <Stack gap={"xs"} my={"xl"}>
            <Group justify="space-between">
              <Text fw={700}>Campionato mondiale 🇦🇺</Text>
              <Text>Anno:2021</Text>
            </Group>
            <Group justify="space-between">
              <Text>voto: 99/100</Text>
              <Group gap="0">
                <Text size="xl">🥇</Text>
                <Text c="dimmed">classificato</Text>
              </Group>
            </Group>
          </Stack>
        </Fieldset>
      </Card>
    </>
  );
}

export default InfoSoggetto;
