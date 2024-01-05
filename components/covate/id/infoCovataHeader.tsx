import { IconsSesso, formatData } from "@/lib/helper";
import { CovataWithGenitori } from "@/types/types";
import { Box, Card, Flex, Group, Text, Title, Tooltip } from "@mantine/core";
import { IconEgg, IconEggCracked, IconEggs } from "@tabler/icons-react";

interface InfoCovataHeaderProps {
  covata: CovataWithGenitori;
}

function InfoCovataHeader({ covata }: InfoCovataHeaderProps) {
  return (
    <Card>
      <Group justify="center">
        <Text>
          <IconEggs size={42} />
        </Text>
        <Title order={2}>Info covata</Title>
      </Group>
      <Box mt="md">
        <Flex columnGap="xl" rowGap="xs" wrap="wrap" justify="center">
          <Group gap="xs">
            <Text>Data:</Text>
            <Text>{formatData(covata.data)}</Text>
          </Group>
          <Group gap="xs">
            <Text>Genitori:</Text>
            <Group gap="md">
              <Group gap={2}>
                <IconsSesso.Male size={22} />
                <Text>{covata.padre.rna + "-" + covata.padre.numero}</Text>
              </Group>
              <Group gap={2}>
                <IconsSesso.Female size={22} />
                <Text>{covata.madre.rna + "-" + covata.madre.numero}</Text>
              </Group>
            </Group>
          </Group>
          <Group gap={2}>
            <Tooltip label="Uova deposte">
              <Group gap={2}>
                <IconEgg size="14" />
                <Text size="xs">{covata.uovaDeposte}</Text>
              </Group>
            </Tooltip>
            <Text size="xs" c="dimmed">
              &bull;
            </Text>
            <Tooltip label="Uova schiuse">
              <Group gap={2}>
                <IconEggCracked size="14" />
                <Text size="xs">{covata.uovaSchiuse}</Text>
              </Group>
            </Tooltip>
          </Group>
        </Flex>
      </Box>
    </Card>
  );
}

export default InfoCovataHeader;
