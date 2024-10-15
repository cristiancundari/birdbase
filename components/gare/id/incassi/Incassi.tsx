import {
  GaraWithIscrizioniWithSoggettoAndProfiloWithAllevatore,
  GaraWithNazioneAndCountIscrizioni,
} from "@/types/types";
import { Card, Flex, Stack, Text } from "@mantine/core";

function Incassi({ gara }: { gara: GaraWithNazioneAndCountIscrizioni }) {
  return (
    <Card p={0} shadow="xs" h="50%">
      <Text fw={500} fz="lg" p="md">
        Dettagli Gara
      </Text>
      <Stack justify="end" align="end" h="100%">
        <Text c="dimmed" fw={500} fz="sm" px="md">
          Prezzo: {gara.prezzo.toFixed(2)} €
        </Text>
        <Text c="dimmed" fw={500} fz="sm" px="md">
          Soggetti Iscritti: {gara._count.iscrizioni}
        </Text>
        <Text fw={500} fz="lg" p="md">
          Incassi: {(gara._count.iscrizioni * gara.prezzo).toFixed(2)} €
        </Text>
      </Stack>
    </Card>
  );
}

export default Incassi;
