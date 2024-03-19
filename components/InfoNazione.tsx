import { Group, Image, Text, Tooltip } from "@mantine/core";
import { Nazione } from "@prisma/client";
import React from "react";

function InfoNazione({
  nazione,
  flagSize,
}: {
  nazione: Nazione;
  flagSize?: "sm" | "md" | "lg";
}) {
  const _flagSize = flagSize || "md";
  const size = {
    sm: "16x12",
    md: "24x18",
    lg: "32x24",
  }[_flagSize];

  return (
    <Tooltip label={nazione.nome}>
      <Group gap="xs" align="center">
        <Image
          src={`https://flagcdn.com/${size}/${nazione.sigla.toLocaleLowerCase()}.png`}
          alt={nazione.nome}
        />
        <Text size="xs" c="dimmed">
          {nazione.sigla}
        </Text>
      </Group>
    </Tooltip>
  );
}

export default InfoNazione;
