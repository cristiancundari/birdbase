"use client";

import ItemPdf from "@/components/portafoglio/itemPdf";

import { useReactToPrint } from "react-to-print";

import {
  ActionIcon,
  Box,
  Center,
  Loader,
  Skeleton,
  Table,
  Title,
} from "@mantine/core";
import { formatValuta, showNotification } from "@/lib/helper";
import { TransazioneWithCategoria } from "@/types/types";
import { Divider, Group, Text, Container, Button, Card } from "@mantine/core";
import {
  IconArrowNarrowLeft,
  IconPrinter,
  IconReport,
} from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import { useEffect, useRef, useState } from "react";

function ReportPage() {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [transazioni, setTransazioni] = useState<TransazioneWithCategoria[]>(
    []
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const dataFine = searchParams.get("dataFine");
  const dataInizio = searchParams.get("dataInizio");
  const tipologia = searchParams.get("tipologia");

  const totale = transazioni
    .map((item) => item.prezzo)
    .reduce((a, b) => a + b, 0);

  useEffect(() => {
    getResult(dataInizio, dataFine, tipologia);
  }, []);

  async function getResult(
    dataInizio: string | null,
    dataFine: string | null,
    tipologia: string | null
  ) {
    setIsLoading(true);
    const result = await apiFetch.get(
      `/api/transazioni?dataInizio=${dataInizio}&dataFine=${dataFine}&tipologia=${tipologia}`
    );
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      setTransazioni(result.data);
      setIsLoading(false);
    }
  }

  if (isLoading)
    return (
      <Card shadow="sm" withBorder p="xl" h={"50vh"}>
        <Center h="100%">
          <Loader size="lg" />
        </Center>
      </Card>
    );

  return (
    <>
      <Container>
        <Group justify={"space-between"} p="xs">
          <ActionIcon
            variant="light"
            size="lg"
            radius="xl"
            aria-label="Indietro"
            onClick={() => {
              router.back();
            }}
          >
            <IconArrowNarrowLeft
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>

          <Button
            onClick={handlePrint}
            variant="light"
            leftSection={<IconPrinter size={14} />}
          >
            Stampa
          </Button>
        </Group>
        <Card shadow="sm" withBorder p="xl">
          <Box ref={componentRef}>
            <style type="text/css" media="print">
              {
                "@page {\
                size: auto;\
                margin: 0;\
              }\
              body {\
                  margin: 0;\
                  padding: 10mm;\
              }\
              table { page-break-inside: auto; }\
              tr    { page-break-inside: avoid; page-break-after: auto; border-bottom: 1px solid #ddd !important; }\
              td,th    { padding: 8px 12px !important; font-size: 12px !important; }\
              thead { display: table-header-group; }\
              tfoot { display: table-footer-group; }"
              }
            </style>
            <Group justify="center">
              <Text>
                <IconReport size={42} />
              </Text>
              <Title order={2}>Report</Title>
            </Group>
            <Box mt="md">
              <Table horizontalSpacing="sm" verticalSpacing="sm" striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Data</Table.Th>
                    <Table.Th>Categoria</Table.Th>
                    <Table.Th>Descrizione</Table.Th>
                    <Table.Th>Prezzo</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {transazioni.map((item, index) => (
                    <ItemPdf item={item} key={item.id} />
                  ))}
                </Table.Tbody>
              </Table>

              <Divider my="sm" />
              <Group justify="space-between">
                <Text fw={500} size="lg">
                  Totale
                </Text>
                <Text c={"dimmed"} size="lg">
                  {formatValuta(totale)}
                </Text>
              </Group>
            </Box>
          </Box>
        </Card>
      </Container>
    </>
  );
}

export default ReportPage;
