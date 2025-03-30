import { Box, Flex, Group, Text, Tooltip } from "@mantine/core";
import {
  IconBarrel,
  IconCoin,
  IconCoinFilled,
  IconCurrencyDollar,
  IconGrave,
} from "@tabler/icons-react";
import React from "react";

function InfoVenduto() {
  return (
    <Tooltip label="Venduto">
      <Flex c="teal">
        <IconCoinFilled size={22} />
      </Flex>
    </Tooltip>
  );
}

export default InfoVenduto;
