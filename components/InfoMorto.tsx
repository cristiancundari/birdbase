import { Group, Text, Tooltip } from "@mantine/core";
import { IconBarrel, IconGrave } from "@tabler/icons-react";
import React from "react";

function InfoMorto() {
  return (
    <Tooltip label="Morto">
      <IconGrave size="16" />
    </Tooltip>
  );
}

export default InfoMorto;
