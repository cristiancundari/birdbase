"use client";
import {
  Box,
  Card,
  Container,
  Grid,
  Group,
  ScrollArea,
  Text,
} from "@mantine/core";
import React from "react";
import GaraComp from "./GaraComp";
import Carrello from "./Carrello";
import InfoGaraHeader from "./InfoGaraHeader";
import { GaraWithNazioneAndCountIscrizioni } from "@/types/types";
const soggetti = [
  {
    sesso: true,
    rna: "48XA",
    numero: 128,
    anno: 2023,
    allevatore: { nome: "Antonello", cognome: "Savoca" },
  },
  {
    sesso: false,
    rna: "72YZ",
    numero: 256,
    anno: 2022,
    allevatore: { nome: "Giovanna", cognome: "Rossi" },
  },
  {
    sesso: true,
    rna: "33BC",
    numero: 512,
    anno: 2021,
    allevatore: { nome: "Luigi", cognome: "Ferrari" },
  },
  {
    sesso: false,
    rna: "89DE",
    numero: 1024,
    anno: 2020,
    allevatore: { nome: "Maria", cognome: "Bianchi" },
  },
  {
    sesso: true,
    rna: "56FG",
    numero: 2048,
    anno: 2019,
    allevatore: { nome: "Roberto", cognome: "Ricci" },
  },
  {
    sesso: false,
    rna: "12HI",
    numero: 4096,
    anno: 2018,
    allevatore: { nome: "Laura", cognome: "Perez" },
  },
  {
    sesso: true,
    rna: "78JK",
    numero: 8192,
    anno: 2017,
    allevatore: { nome: "Michele", cognome: "Lopez" },
  },
  {
    sesso: false,
    rna: "45LM",
    numero: 16384,
    anno: 2016,
    allevatore: { nome: "Francesca", cognome: "Martin" },
  },
  {
    sesso: true,
    rna: "23NO",
    numero: 32768,
    anno: 2015,
    allevatore: { nome: "Paolo", cognome: "Gomez" },
  },
  {
    sesso: false,
    rna: "67PQ",
    numero: 65536,
    anno: 2014,
    allevatore: { nome: "Anna", cognome: "Lee" },
  },
];

function InfoGara({ gara }: { gara: GaraWithNazioneAndCountIscrizioni }) {
  return (
    <Container h="100vh">
      <InfoGaraHeader gara={gara} />
      <Grid grow mt={"sm"}>
        <Grid.Col span={4}>
          <ScrollArea h="500" w="100%">
            <Card>
              <Text size="xl" fw="500" p="md">
                Lista soggetti iscritti
              </Text>
              {soggetti.map((soggetto) => (
                <Box p="sm">
                  <GaraComp soggetto={soggetto} />
                </Box>
              ))}
            </Card>
          </ScrollArea>
        </Grid.Col>
        <Grid.Col span={1}>
          <Card p={0} pos="relative">
            <Carrello gara={gara} />
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default InfoGara;
