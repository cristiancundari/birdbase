import { formatData } from "@/lib/helper";
import { Group, Progress, Stack, Text } from "@mantine/core";
import { Soggetto } from "@prisma/client";
import { IconBarrel, IconHeart, IconHeartFilled } from "@tabler/icons-react";
import React from "react";

interface comboboxGenitoriItemProps {
  soggetto: Soggetto;
  parentela: { nome: string; percentuale: number; colore: string };
}

function comboboxGenitoriItem({
  soggetto,
  parentela,
}: comboboxGenitoriItemProps) {
  return (
    <Group grow>
      <Stack gap="0">
        <Text size="sm">{soggetto.rna + "-" + soggetto.numero}</Text>
        <Text size="xs" c="dimmed">
          {formatData(soggetto.dataNascita)}
        </Text>
      </Stack>
      <Stack gap={0}>
        {soggetto.gabbia && (
          <Group gap={2}>
            <IconBarrel size={14} />
            <Text size="xs" c="dimmed">
              {soggetto.gabbia}
            </Text>
          </Group>
        )}
        <Group>
          {soggetto.preferito && (
            <IconHeartFilled size={14} style={{ color: "red" }} />
          )}
        </Group>
      </Stack>
      <Stack gap="0">
        <Text size="xs" c="dimmed">
          {parentela.nome}
        </Text>
        <Progress
          size="md"
          value={parentela.percentuale}
          color={parentela.colore}
        ></Progress>
      </Stack>
    </Group>
  );
}

export default comboboxGenitoriItem;
