import React from "react";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  Divider,
} from "@mantine/core";
import Flag from "react-world-flags";
import { GaraWithNazione } from "@/types/types";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

function gara({ gara }: { gara: GaraWithNazione }) {
  const newGara = differenceInDays(Date.now(), gara.createdAt);
  const inScadenza = differenceInDays(gara.dataEvento, Date.now());

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={gara.immagine} height={160} alt="Norway" />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs" wrap="nowrap">
        <Text fw={500}>{gara.titolo}</Text>
        <Stack gap="xs">
          {newGara > 0 && newGara < 7 && (
            <Badge color="green" variant="light" style={{ flexShrink: 0 }}>
              Nuovo
            </Badge>
          )}
          {inScadenza > 0 && inScadenza < 7 && (
            <Badge color="pink" variant="light" style={{ flexShrink: 0 }}>
              In scadenza
            </Badge>
          )}
        </Stack>
      </Group>

      <Stack gap={"xs"}>
        <Group gap={"xs"}>
          <Text size="sm">Tipologia:</Text>
          <Text size="sm" c="dimmed">
            {gara.tipologia}
          </Text>
        </Group>
        <Group gap={"xs"}>
          <Text size="sm">Data:</Text>
          <Text size="sm" c="dimmed">
            {format(gara.dataEvento, "dd/MM/yyyy")}
          </Text>
        </Group>
        <Group justify="space-between">
          <Group gap={"xs"}>
            <Text size="sm">Città:</Text>
            <Text size="sm" c="dimmed">
              {gara.citta}
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Flag
              code={gara.nazione.sigla}
              height={16}
              style={{ boxShadow: "0px 0px 5px 0px #00000047" }}
            />
            <Text size="sm" c="dimmed">
              {gara.nazione.nome}
            </Text>
          </Group>
        </Group>
        <Divider my="md" variant="dashed" />
        <Group justify="space-between">
          <Stack gap={0}>
            <Text size="xs" c="dimmed">
              Prezzo iscrizione
            </Text>
            <Text size="xl">€ 35,00</Text>
          </Stack>
          <Stack gap={0}>
            <Text size="xs" c="dimmed">
              Posti disponibili
            </Text>
            <Text size="xs">58/100</Text>
          </Stack>
        </Group>
      </Stack>

      <Button
        component="a"
        href={`/app/gare/${gara.id}`}
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
      >
        Iscriviti
      </Button>
    </Card>
  );
}

export default gara;
