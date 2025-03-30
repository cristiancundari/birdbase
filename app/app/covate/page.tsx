import CovatePage from "@/components/covate/covatePage";
import { Box } from "@mantine/core";
import React from "react";

function Covate() {
  return (
    <Box data-testid="covate">
      <CovatePage />;
    </Box>
  );
}

export default Covate;
