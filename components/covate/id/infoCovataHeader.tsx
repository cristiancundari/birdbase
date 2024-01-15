import { IconSessoFemale, IconSessoMale } from "@/components/IconsSesso";
import { formatAnelletto, formatData } from "@/lib/helper";
import { CovataWithGenitori, CovataWithGenitoriAndFigli } from "@/types/types";
import {
  Box,
  Button,
  Card,
  Flex,
  Group,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconBarrel,
  IconEdit,
  IconEgg,
  IconEggCracked,
  IconEggs,
} from "@tabler/icons-react";
import InfoUova from "../infoUova";
import Completata from "../completata";
import InfoGabbia from "@/components/InfoGabbia";

interface InfoCovataHeaderProps {
  covata: CovataWithGenitoriAndFigli;
}

function InfoCovataHeader({ covata }: InfoCovataHeaderProps) {
  return (
    <Card shadow="sm" withBorder pos="relative">
      <Group justify="center">
        <Text>
          <IconEggs size={42} />
        </Text>
        <Title order={2}>Info covata</Title>
      </Group>
      <Box mt="md">
        <Flex columnGap="xl" rowGap="xs" wrap="wrap" justify="center">
          <Group gap="xs">
            {covata.completata && <Completata />}
            <Text>Data covata:</Text>
            <Text>{formatData(covata.data)}</Text>
          </Group>
          <Group gap="xs">
            <Text>Genitori:</Text>
            <Group gap="md">
              <Group gap={2}>
                <IconSessoMale size={22} />
                <Text>
                  {formatAnelletto(
                    covata.padre.rna,
                    covata.padre.numero,
                    covata.padre.anno
                  )}
                </Text>
              </Group>
              <Group gap={2}>
                <IconSessoFemale size={22} />
                <Text>
                  {formatAnelletto(
                    covata.madre.rna,
                    covata.madre.numero,
                    covata.madre.anno
                  )}
                </Text>
              </Group>
            </Group>
          </Group>
          <InfoGabbia gabbia={covata.gabbia} hideNull />
          <InfoUova
            deposte={covata.uovaDeposte}
            schiuse={covata.figli.length}
          />
        </Flex>
      </Box>
    </Card>
  );
}

export default InfoCovataHeader;
