"use client";
import { Container, Grid, Paper, Stack, Group, Button } from "@mantine/core";
import { IconReport } from "@tabler/icons-react";
import Budget from "./budget";
import ModalReport, { FormValues } from "./modalReport";
import BarChart from "./grafici/barchart";
import PieChart from "./grafici/piechart";
import Transazioni from "./transazioni/transazioni";
import React, { SetStateAction, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import { format } from "date-fns";

export const PortafoglioContext = React.createContext<
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
  const [isModalReportOpen, setIsModalReportOpen] = useState(false);
  const router = useRouter();

  const modalReportHandler = () => {
    setIsModalReportOpen(true);
  };

  const annulla = () => {
    setIsModalReportOpen(false);
  };

  const submit = async (values: FormValues) => {
    const dataInizio = values.dataInizio
      ? format(values.dataInizio, "yyyy-MM-dd")
      : "";
    const dataFine = values.dataFine
      ? format(values.dataFine, "yyyy-MM-dd")
      : "";
    router.push(
      `/app/portafoglio/report?dataInizio=${dataInizio}&dataFine=${dataFine}&tipologia=${values.tipologia}`
    );
  };

  return (
    <>
      <PortafoglioContext.Provider
        value={{ state: forceRender, setState: setForceRender }}
      >
        <Container size={"lg"} p={0}>
          <Group justify={"flex-end"} p="xs">
            <Button
              onClick={modalReportHandler}
              variant="light"
              leftSection={<IconReport size={14} />}
            >
              Genera Report
            </Button>
          </Group>
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
      <ModalReport
        isOpen={isModalReportOpen}
        annulla={annulla}
        submit={submit}
      />
    </>
  );
}

export default PortafoglioPage;
