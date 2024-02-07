import { formatData } from "@/lib/helper";
import { GaraWithNazioneAndCountIscrizioni } from "@/types/types";
import { Box, Card, Flex, Group, Image, Text, Title } from "@mantine/core";
import { Gara } from "@prisma/client";
import { IconCup, IconTrophy } from "@tabler/icons-react";
import React from "react";

function InfoGaraHeader({ gara }: { gara: GaraWithNazioneAndCountIscrizioni }) {
  return (
    <Card shadow="sm" withBorder pos="relative">
      <Group justify="center">
        <Text>
          <IconTrophy size={42} />
        </Text>
        <Title order={2}>{gara.titolo}</Title>
      </Group>
      <Box mt="md">
        <Flex columnGap="xl" rowGap="xs" wrap="wrap" justify="center">
          <Group gap="xs">
            <Text>Data gara:</Text>
            <Text>{formatData(gara.data)}</Text>
          </Group>
          <Group gap="xs">
            <Text>Tipologia:</Text>
            <Text>{gara.tipologia}</Text>
          </Group>
          <Group gap="xs">
            <Text>Posti disponibili:</Text>
            <Text>
              {gara.capienza - gara._count.iscrizioni}/{gara.capienza}
            </Text>
          </Group>
          <Group gap="xs">
            <Text>Città:</Text>
            <Text>{gara.citta}</Text>
          </Group>
          <Group gap="xs">
            <Text>Nazione:</Text>
            <Image
              src={`https://flagcdn.com/h20/${gara.nazione.sigla.toLocaleLowerCase()}.jpg`}
              style={{ boxShadow: "0px 0px 5px 0px #00000047" }}
              alt={gara.nazione.nome}
              height={16}
            />
          </Group>
        </Flex>
      </Box>
    </Card>
  );
}

export default InfoGaraHeader;
