import {
  ActionIcon,
  Box,
  Button,
  Group,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconArrowNarrowRight,
  IconCurrencyEuro,
  IconPlus,
  IconShoppingCart,
} from "@tabler/icons-react";
import GaraComp from "./GaraComp";
import { GaraWithNazioneAndCountIscrizioni } from "@/types/types";
import CarrelloComp from "./CarrelloComp";
import { useState } from "react";
import { format } from "path";
import { formatValuta } from "@/lib/helper";

const soggetti = [
  {
    id: 1,
    sesso: true,
    rna: "48XA",
    numero: 128,
    anno: 2023,
    allevatore: { nome: "Antonello", cognome: "Savoca" },
  },
  {
    id: 2,
    sesso: false,
    rna: "72YZ",
    numero: 256,
    anno: 2022,
    allevatore: { nome: "Giovanna", cognome: "Rossi" },
  },
  {
    id: 3,
    sesso: true,
    rna: "33BC",
    numero: 512,
    anno: 2021,
    allevatore: { nome: "Luigi", cognome: "Ferrari" },
  },
  {
    id: 4,
    sesso: false,
    rna: "89DE",
    numero: 1024,
    anno: 2020,
    allevatore: { nome: "Maria", cognome: "Bianchi" },
  },
  {
    id: 5,
    sesso: true,
    rna: "56FG",
    numero: 2048,
    anno: 2019,
    allevatore: { nome: "Roberto", cognome: "Ricci" },
  },
  {
    id: 6,
    sesso: false,
    rna: "12HI",
    numero: 4096,
    anno: 2018,
    allevatore: { nome: "Laura", cognome: "Perez" },
  },
  {
    id: 7,
    sesso: true,
    rna: "78JK",
    numero: 8192,
    anno: 2017,
    allevatore: { nome: "Michele", cognome: "Lopez" },
  },
  {
    id: 8,
    sesso: false,
    rna: "45LM",
    numero: 16384,
    anno: 2016,
    allevatore: { nome: "Francesca", cognome: "Martin" },
  },
  {
    id: 9,
    sesso: true,
    rna: "23NO",
    numero: 32768,
    anno: 2015,
    allevatore: { nome: "Paolo", cognome: "Gomez" },
  },
  {
    id: 10,
    sesso: false,
    rna: "67PQ",
    numero: 65536,
    anno: 2014,
    allevatore: { nome: "Anna", cognome: "Lee" },
  },
];

function Carrello({ gara }: { gara: GaraWithNazioneAndCountIscrizioni }) {
  const [listaSoggetti, setListaSoggetti] = useState(soggetti);
  const [totale, setTotale] = useState(soggetti.length * gara.prezzo);

  function onDelete(id: number) {
    const newListaSoggetti = listaSoggetti.filter((s) => s.id !== id);
    const carrelloTotale = newListaSoggetti.length * gara.prezzo;
    setListaSoggetti(newListaSoggetti);
    setTotale(carrelloTotale);
  }

  return (
    <Stack justify="space-between">
      <Group justify={"flex-end"} p={"md"}>
        <Button
          onClick={() => {}}
          variant="light"
          leftSection={<IconPlus size={14} />}
        >
          Iscrivi
        </Button>
      </Group>

      <ScrollArea h="300" w="100%">
        {listaSoggetti.map((soggetto) => (
          <Box p="sm">
            <CarrelloComp soggetto={soggetto} gara={gara} onDelete={onDelete} />
          </Box>
        ))}
      </ScrollArea>

      <Group
        justify="space-between"
        style={{
          background: "linear-gradient(to right, #46b83d, #111e0b)",
          color: "white",
        }}
        p={"md"}
      >
        <Group gap="sm">
          <Text fw={600} size="lg">
            {formatValuta(totale)}
          </Text>
        </Group>
        <Group gap="sm">
          <IconShoppingCart />
          <ActionIcon variant="transparent" aria-label="Settings">
            <IconArrowNarrowRight color="white" />
          </ActionIcon>
        </Group>
      </Group>
    </Stack>
  );
}

export default Carrello;
