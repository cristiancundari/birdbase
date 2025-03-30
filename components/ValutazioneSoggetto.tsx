import { Badge, Box, Tooltip } from "@mantine/core";
import React from "react";

interface ValutazioneSoggettoProps {
  valutazione?: number;
}

const getColor = (value: number) => {
  if (value < 30) {
    return "teal";
  } else if (value < 50) {
    return "lime";
  } else if (value < 80) {
    return "yellow";
  }
  return "red";
};

function ValutazioneSoggetto({ valutazione }: ValutazioneSoggettoProps) {
  if (valutazione) {
    return (
      <Tooltip label="Valutazione">
        <Box ml="auto">
          <Badge size="xl" variant="light" color={getColor(valutazione)} circle>
            {valutazione.toFixed(0)}
          </Badge>
        </Box>
      </Tooltip>
    );
  } else {
    return <></>;
  }
}

export default ValutazioneSoggetto;
