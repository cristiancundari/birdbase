import { Anchor, Flex, Group, Text } from "@mantine/core";
import { IconSessoFemale, IconSessoMale } from "../IconsSesso";

function GaraComp({ soggetto }: { soggetto: any }) {
  return (
    <Flex gap="md" justify="space-between">
      <Group gap="sm">
        {soggetto.sesso ? <IconSessoMale /> : <IconSessoFemale />}
        <Anchor href="/" c="dark">
          {soggetto.rna}-{soggetto.numero}-{soggetto.anno}
        </Anchor>
      </Group>

      <Group>
        <Text c={"dimmed"}>
          {soggetto.allevatore.nome} {soggetto.allevatore.cognome}
        </Text>
      </Group>
    </Flex>
  );
}

export default GaraComp;
