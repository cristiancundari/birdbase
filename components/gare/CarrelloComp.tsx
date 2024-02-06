import { formatValuta } from "@/lib/helper";
import { GaraWithNazioneAndCountIscrizioni } from "@/types/types";
import { ActionIcon, Anchor, Group, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import React from "react";
import { IconSessoFemale, IconSessoMale } from "../IconsSesso";

interface CarrelloCompProps {
  soggetto: any;
  gara: GaraWithNazioneAndCountIscrizioni;
  onDelete: (id: number) => void;
}
function CarrelloComp({ soggetto, gara, onDelete }: CarrelloCompProps) {
  return (
    <Group justify="space-between">
      <Group gap="sm">
        {soggetto.sesso ? <IconSessoMale /> : <IconSessoFemale />}
        <Anchor href="/" c="dark">
          {soggetto.rna}-{soggetto.numero}-{soggetto.anno}
        </Anchor>
      </Group>

      <Group gap="sm">
        <Text c={"dimmed"}>{formatValuta(gara.prezzo)}</Text>
        <ActionIcon
          variant="transparent"
          aria-label="Settings"
          onClick={() => onDelete(soggetto.id)}
        >
          <IconX color="gray" size={16} />
        </ActionIcon>
      </Group>
    </Group>
  );
}

export default CarrelloComp;
