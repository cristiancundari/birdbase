import { Anchor, Flex, Group, Text } from "@mantine/core";
import { IconSessoFemale, IconSessoMale } from "../../../IconsSesso";
import { IscrizioneWithSoggettoAndProfiloWithAllevatore } from "@/types/types";
import { formatAnelletto } from "@/lib/helper";

function IscrizioneItem({
  iscrizione,
}: {
  iscrizione: IscrizioneWithSoggettoAndProfiloWithAllevatore;
}) {
  const soggetto = iscrizione.soggetto;
  const allevatore = iscrizione.profilo.allevatore;
  return (
    <Flex gap="md" justify="space-between">
      <Group gap="sm">
        {
          //TODO sistemare sesso e link
        }
        {soggetto.sesso ? <IconSessoMale /> : <IconSessoFemale />}
        <Anchor href="/" c="dark">
          {formatAnelletto(soggetto.rna, soggetto.numero, soggetto.anno)}
        </Anchor>
      </Group>

      <Group>
        <Text c="dimmed">
          {allevatore.nome} {allevatore.cognome}
        </Text>
      </Group>
    </Flex>
  );
}

export default IscrizioneItem;
