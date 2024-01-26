import { ThemeIcon, Tooltip } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import React from "react";

function Completata() {
  return (
    <Tooltip label="Completata">
      <ThemeIcon
        radius="xl"
        color="teal"
        size="xs"
        data-testid="IconCompletata"
      >
        <IconCheck size={14} />
      </ThemeIcon>
    </Tooltip>
  );
}

export default Completata;
