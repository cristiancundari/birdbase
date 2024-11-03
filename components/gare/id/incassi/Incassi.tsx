import { formatValuta } from "@/lib/helper";
import {
  GaraWithIscrizioniWithSoggettoAndProfiloWithAllevatore,
  GaraWithNazioneAndCountIscrizioni,
} from "@/types/types";
import { Card, Flex, Stack, Text } from "@mantine/core";

function Incassi({ gara }: { gara: GaraWithNazioneAndCountIscrizioni }) {
  return (
    <Card p={0} shadow="xs" h="50%" data-testid="incassi-test">
      <Text fw={500} fz="lg" p="md">
        Dettagli Gara
      </Text>
      <Stack justify="end" align="end" h="100%">
        <Text c="dimmed" fw={500} fz="sm" px="md">
          Prezzo: {formatValuta(gara.prezzo)}
        </Text>
        <Text c="dimmed" fw={500} fz="sm" px="md">
          Soggetti Iscritti: {gara._count.iscrizioni}
        </Text>
        <Text fw={500} fz="lg" p="md">
          Incassi: {formatValuta(gara._count.iscrizioni * gara.prezzo)}
        </Text>
      </Stack>
    </Card>
  );
}

export default Incassi;
