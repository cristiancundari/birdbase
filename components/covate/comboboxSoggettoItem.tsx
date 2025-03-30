import { formatAnelletto, formatData } from "@/lib/helper";
import { Group, Progress, Stack, Text } from "@mantine/core";
import { Soggetto } from "@prisma/client";
import { IconBarrel, IconHeart, IconHeartFilled } from "@tabler/icons-react";
import React from "react";
import InfoGabbia from "../InfoGabbia";
import ValutazioneSoggetto from "../ValutazioneSoggetto";

interface ComboboxSoggettoItemProps {
  soggetto: Soggetto;
  parentela: { nome: string; percentuale: number; colore: string } | null;
  valutazione?: number;
}

function ComboboxSoggettoItem({ soggetto, parentela, valutazione }: ComboboxSoggettoItemProps) {
  return (
    <Group grow>
      <Stack gap="0">
        <Text size="sm">{formatAnelletto(soggetto.rna, soggetto.numero, soggetto.anno)}</Text>
        <Text size="xs" c="dimmed">
          {formatData(soggetto.dataNascita)}
        </Text>
      </Stack>
      <Stack gap={0}>
        <InfoGabbia gabbia={soggetto.gabbia} hideNull />
        <Group>{soggetto.preferito && <IconHeartFilled size={14} style={{ color: "red" }} />}</Group>
      </Stack>
      <Stack>
        {parentela && (
          <Stack gap="0">
            <Text size="xs" c="dimmed">
              {parentela.nome}
            </Text>
            <Progress size="md" value={parentela.percentuale} color={parentela.colore}></Progress>
          </Stack>
        )}
        <ValutazioneSoggetto valutazione={valutazione} />
      </Stack>
    </Group>
  );
}

export default ComboboxSoggettoItem;
