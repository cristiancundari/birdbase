"use client";
import React from "react";
import {
  Container,
  Grid,
  Paper,
  Stack,
  parseThemeColor,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import PieChart from "./grafici/piechart";
import BarChart from "./grafici/barchart";
import Budget from "./budget";
import Transazioni from "./transazioni/transazioni";

function PortafoglioPage() {
  return (
    <Container size={"lg"} p={0}>
      <Grid columns={2} p="xs">
        <Grid.Col span={{ base: 2, md: 1 }} order={{ base: 2, md: 1 }}>
          <Stack h="100%">
            <Budget />
            <Transazioni />
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 2, md: 1 }} order={{ base: 1, md: 2 }}>
          <Stack>
            <Paper p="md" shadow="xs">
              <PieChart />
            </Paper>
            <Paper p="md" shadow="xs">
              <BarChart
                series={[44, 147, 41, 17, 15, 0, 55, 41, 17, 15, 22, 6]}
              />
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default PortafoglioPage;
