"use client";
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
  Box,
  Menu,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { GaraWithNazioneAndCountIscrizioni } from "@/types/types";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import {
  IconDotsVertical,
  IconEye,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { formatValuta, getBucketImgPath } from "@/lib/helper";
import { Role } from "@prisma/client";
import Link from "next/link";
import InfoNazione from "../InfoNazione";

function GaraCard({
  gara,
  onDelete,
  onEdit,
}: {
  gara: GaraWithNazioneAndCountIscrizioni;
  onDelete: (id: string) => void;
  onEdit: (gara: GaraWithNazioneAndCountIscrizioni) => void;
}) {
  const supabase = useSupabase();
  const newGara = differenceInDays(Date.now(), gara.createdAt);
  const inScadenza = differenceInDays(gara.data, Date.now());

  const badges = [
    {
      condizione: !gara.isDeleted && newGara >= 0 && newGara < 7,
      titolo: "Nuovo",
      color: "green",
      variant: "filled",
    },
    {
      condizione: !gara.isDeleted && inScadenza >= 0 && inScadenza < 7,
      titolo: "In Scadenza",
      color: "yellow",
    },
    {
      condizione: !gara.isDeleted && gara.stato == "BOZZA",
      titolo: "Bozza",
      color: "grape",
    },
    {
      condizione: !gara.isDeleted && gara.stato == "COMPLETATA",
      titolo: "Completata",
      color: "green",
    },
    {
      condizione: !gara.isDeleted && gara.stato == "VALUTAZIONE",
      titolo: "Da Valutare",
      color: "blue",
    },
    {
      condizione: gara.isDeleted,
      titolo: "Eliminata",
      color: "red",
    },
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Box pos="relative">
          <Image
            src={
              gara.immagine
                ? getBucketImgPath("img", gara.immagine)
                : `https://images.placeholders.dev/?width=200&height=90&fontSize=8&text=${gara.titolo}`
            }
            height={160}
            alt={gara.titolo}
          />
          {supabase.user?.ruolo === Role.ADMIN && (
            <Menu shadow="md">
              <Menu.Target>
                <ActionIcon
                  variant="white"
                  radius="xl"
                  color="gray"
                  pos="absolute"
                  top="10px"
                  right="10px"
                >
                  <IconDotsVertical size="14" />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEye size="14" />}
                  component="a"
                  href={`/admin/gare/${gara.id}`}
                >
                  Dettagli
                </Menu.Item>
                {!gara.isDeleted && (
                  <>
                    <Menu.Item
                      leftSection={<IconPencil size="14" />}
                      onClick={() => {
                        onEdit(gara);
                      }}
                    >
                      Modifica
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconTrash size="14" />}
                      color="red"
                      onClick={() => {
                        onDelete(gara.id);
                      }}
                    >
                      Elimina
                    </Menu.Item>
                  </>
                )}
              </Menu.Dropdown>
            </Menu>
          )}
        </Box>
      </Card.Section>

      <Group justify="start" mt="md" mb="xs">
        {badges.map((badge, index) => {
          return (
            badge.condizione && (
              <Badge
                color={badge.color}
                key={index}
                variant={badge.variant || "light"}
              >
                {badge.titolo}
              </Badge>
            )
          );
        })}
      </Group>

      <Stack gap={"xs"} h="100%">
        <Text fw={500} size="lg">
          {gara.titolo}
        </Text>
        <Group gap={"xs"}>
          <Text size="sm">Tipologia:</Text>
          <Text size="sm" c="dimmed">
            {gara.tipologia}
          </Text>
        </Group>
        <Group justify="space-between" gap={"xs"}>
          <Group gap={"xs"}>
            <Text size="sm">Data:</Text>
            <Text size="sm" c="dimmed">
              {format(gara.data, "dd/MM/yyyy")}
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Text size="sm">Città:</Text>
            <Text size="sm" c="dimmed">
              {gara.citta}
            </Text>
          </Group>
          <InfoNazione nazione={gara.nazione} />
        </Group>
        <Box style={{ flexGrow: 1 }}></Box>
        <Divider my="md" variant="dashed" />
        <Group justify="space-between">
          <Stack gap={0}>
            <Text size="xs" c="dimmed">
              Prezzo iscrizione
            </Text>
            <Text size="xl">{formatValuta(gara.prezzo)}</Text>
          </Stack>
          <Stack gap={0}>
            <Text size="xs" c="dimmed">
              Posti disponibili
            </Text>
            <Text size="xs">
              {gara.capienza - gara._count.iscrizioni}/{gara.capienza}
            </Text>
          </Stack>
        </Group>
        {supabase.user?.ruolo !== Role.ADMIN && (
          <Button
            component={Link}
            href={`/app/gare/${gara.id}`}
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            radius="md"
          >
            Visualizza
          </Button>
        )}
      </Stack>
    </Card>
  );
}

export default GaraCard;
