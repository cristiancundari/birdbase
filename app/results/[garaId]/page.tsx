import { getIconSesso } from "@/components/IconsSesso";
import { formatAnelletto, formatData, getBucketImgPath } from "@/lib/helper";
import { prisma } from "@/lib/prisma";
import { validate } from "uuid";
import {
  Avatar,
  Box,
  Card,
  Center,
  Flex,
  Group,
  Image,
  rem,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { redirect } from "next/navigation";
import React from "react";
import Head from "next/head";
import { headers } from "next/headers";
import { Metadata } from "next";

async function getData({
  garaId,
  soggettoId,
}: {
  garaId: string;
  soggettoId: string;
}) {
  return await prisma.gara.findFirst({
    where: {
      id: garaId,
    },
    include: {
      iscrizioni: {
        where: {
          soggettoId: soggettoId,
        },
        select: {
          posizione: true,
          voto: true,
          soggetto: {
            select: {
              id: true,
              avatar: true,
              rna: true,
              numero: true,
              anno: true,
              sesso: true,
              dataNascita: true,
            },
          },
          profilo: {
            select: {
              allevatore: {
                select: {
                  nome: true,
                  cognome: true,
                  rna: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { garaId: string };
  searchParams: { s: string };
}) {
  const garaId = params.garaId;
  const soggettoId = searchParams.s;
  if (!garaId || !soggettoId || !validate(garaId) || !validate(soggettoId)) {
    return {};
  }

  const result = await getData({ garaId, soggettoId });

  if (!result) return {};

  const allevatore = result.iscrizioni[0].profilo.allevatore;
  const sogg = result.iscrizioni[0].soggetto;

  return {
    openGraph: {
      title: `🎊 Complimenti ${allevatore.nome} ${allevatore.cognome}`,
      description: `Il tuo soggetto ha ottenuto un punteggio di ${result.iscrizioni[0].voto}/100 piazzandosi alla posizione numero ${result.iscrizioni[0].posizione} della classifica.`,
      images: [
        result.immagine
          ? getBucketImgPath("img", result.immagine)
          : `https://placehold.co/1200x630/jpg?text=${result.titolo}`,
      ],
      url: `/results/${result.id}?s=${sogg.id}`,
      type: "website",
    },
    "twitter:card": "summary_large_image",
    "twitter:title": `🎊 Complimenti ${allevatore.nome} ${allevatore.cognome}`,
    "twitter:description": `Il tuo soggetto ha ottenuto un punteggio di ${result.iscrizioni[0].voto}/100 piazzandosi alla posizione numero ${result.iscrizioni[0].posizione} della classifica.`,
    "twitter:image": result.immagine
      ? getBucketImgPath("img", result.immagine)
      : `https://placehold.co/1200x630/jpg?text=${result.titolo}`,
  };
}

async function RersultsPage({
  params,
  searchParams,
}: {
  params: { garaId: string };
  searchParams: { s: string };
}) {
  const garaId = params.garaId;
  const soggettoId = searchParams.s;
  if (!garaId || !soggettoId || !validate(garaId) || !validate(soggettoId)) {
    console.log("Parametri non validi", garaId, soggettoId);
    return redirect("/app/home");
  }

  const result = await getData({ garaId, soggettoId });

  if (!result) {
    console.log("Nessun risultato");
    return redirect("/app/home");
  }

  const allevatore = result.iscrizioni[0].profilo.allevatore;
  const sogg = result.iscrizioni[0].soggetto;
  const posizioni = ["🥇", "🥈", "🥉"];

  return (
    <>
      <Center h="100%">
        <Flex align="center" justify="center" direction="column">
          <Card shadow="xs" padding="lg">
            <Group gap="xs" justify="center">
              <Text size={rem(50)}>🎊</Text>
              <Title order={1}>
                Complimenti {allevatore.nome} {allevatore.cognome}!
              </Title>
            </Group>

            <Space h="lg" />
            <Space h="lg" />

            <Group align="center" justify="center" gap="60">
              <Group justify="center" gap="xs">
                <Avatar
                  data-testid="ImgAvatar"
                  variant="filled"
                  size="xl"
                  src={
                    sogg.avatar
                      ? getBucketImgPath("img", sogg.avatar)
                      : `https://images.placeholders.dev/?width=50&height=50&textWrap=true&text=${formatAnelletto(
                          sogg.rna,
                          sogg.numero,
                          sogg.anno
                        )}`
                  }
                />
                <Group gap="xs">
                  {getIconSesso(sogg.sesso, 35)}
                  <Stack gap="0">
                    <Text size="lg" fw="bold" ta="start">
                      {formatAnelletto(sogg.rna, sogg.numero, sogg.anno)}
                    </Text>
                    <Text size="sm" ta="start">
                      {formatData(sogg.dataNascita)}
                    </Text>
                  </Stack>
                </Group>
              </Group>
              <Box>
                {result.iscrizioni[0].posizione == null ? (
                  <Text fs="italic" size="sm" c="dimmed">
                    N.C.
                  </Text>
                ) : (
                  <Text size={rem(75)}>
                    {posizioni[result.iscrizioni[0].posizione - 1] || ""}
                  </Text>
                )}
              </Box>
            </Group>

            <Space h="lg" />
            <Space h="lg" />

            <Stack align="center" gap="0">
              {result.immagine && <Image src={result.immagine} alt="gara" />}
              <Title order={3}>{result.titolo}</Title>
              <Text>
                tenutasi il {formatData(result.data)} a {result.citta}
              </Text>
            </Stack>

            <Space h="lg" />

            <Stack align="center" gap="0">
              <Text size="sm">
                Il tuo soggetto ha ottenuto un punteggio di{" "}
                {result.iscrizioni[0].voto}/100
              </Text>
              <Text size="sm">
                piazzandosi alla posizione numero{" "}
                {result.iscrizioni[0].posizione} della classifica.
              </Text>
            </Stack>
          </Card>
        </Flex>
      </Center>
    </>
  );
}

export default RersultsPage;
