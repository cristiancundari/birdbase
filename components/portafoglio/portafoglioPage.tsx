"use client";
import { Container, Grid, Paper, Stack } from "@mantine/core";
import Budget from "./budget";
import BarChart from "./grafici/barchart";
import PieChart from "./grafici/piechart";
import Transazioni from "./transazioni/transazioni";
import React, { SetStateAction, useContext, useState } from "react";

const PortafoglioContext = React.createContext<
  | { state: number; setState: React.Dispatch<React.SetStateAction<number>> }
  | undefined
>(undefined);

export function usePortafoglioContext() {
  const context = useContext(PortafoglioContext);
  if (context === undefined) {
    throw new Error(
      "usePortafoglioContext must be within PortafoglioContextProvider"
    );
  }
  return context;
}

function PortafoglioPage() {
  const [forceRender, setForceRender] = useState(0);

  return (
    <PortafoglioContext.Provider
      value={{ state: forceRender, setState: setForceRender }}
    >
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
                <BarChart />
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </PortafoglioContext.Provider>
  );
}

export default PortafoglioPage;
