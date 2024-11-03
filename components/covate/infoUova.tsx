import { Group, Text, Tooltip } from "@mantine/core";
import { IconEgg, IconEggCracked } from "@tabler/icons-react";

function InfoUova({ deposte, schiuse }: { deposte: number; schiuse: number }) {
  return (
    <Group gap={2}>
      <Tooltip label="Uova deposte">
        <Group gap={2}>
          <IconEgg size="14" />
          <Text size="xs" data-testid="info-uova-deposte">
            {deposte}
          </Text>
        </Group>
      </Tooltip>
      <Text size="xs" c="dimmed">
        &bull;
      </Text>
      <Tooltip label="Uova schiuse">
        <Group gap={2}>
          <IconEggCracked size="14" />
          <Text size="xs" data-testid="info-uova-schiuse">
            {schiuse}
          </Text>
        </Group>
      </Tooltip>
    </Group>
  );
}

export default InfoUova;
