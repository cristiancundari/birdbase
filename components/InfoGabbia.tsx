import { Group, Text, Tooltip } from "@mantine/core";
import { IconBarrel } from "@tabler/icons-react";
import React from "react";

function InfoGabbia({
  gabbia,
  hideNull,
}: {
  gabbia: number | null;
  hideNull?: boolean;
}) {
  return hideNull == true && gabbia == null ? null : (
    <Tooltip label={`Gabbia #${gabbia || "-"}`}>
      <Group gap={3}>
        <IconBarrel size="16" data-testid={"IconGabbia"} />
        <Text size="xs">{gabbia || "-"}</Text>
      </Group>
    </Tooltip>
  );
}

export default InfoGabbia;
