import { Group, Text, Tooltip } from "@mantine/core";
import { IconBarrel, IconGrave } from "@tabler/icons-react";
import React from "react";

function InfoMorto() {
  return (
    <Tooltip label="Morto">
      <IconGrave size="16" data-testid="IconMorto" />
    </Tooltip>
  );
}

export default InfoMorto;
