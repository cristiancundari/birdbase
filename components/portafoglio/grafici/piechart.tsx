"use client";
import { apiFetch } from "@/lib/apiFetch";
import {
  formatValuta,
  getRangeYears,
  showNotification,
  transazioniIconColor,
} from "@/lib/helper";
import {
  Box,
  Button,
  Center,
  Combobox,
  ComboboxChevron,
  Group,
  Skeleton,
  Stack,
  Text,
  parseThemeColor,
  useCombobox,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePortafoglioContext } from "../portafoglioPage";
import NessunGrafico from "./NessunGrafico";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <PieChartSkeleton />,
});

interface GraphApiData {
  categoria: string;
  totale: number;
  anno: number;
}
interface GraphData {
  colors: string[];
  labels: string[];
  series: number[];
}

function PieChart() {
  const { state: forceRender } = usePortafoglioContext();
  const theme = useMantineTheme();
  const colorScheme = useMantineColorScheme().colorScheme;
  const [isLoading, setIsLoading] = useState(true);
  const [listaSpese, setListaSpese] = useState<GraphApiData[]>([]);
  const [graphData, setGraphData] = useState<GraphData>({
    colors: [],
    series: [],
    labels: [],
  });
  const currentAnno = new Date().getFullYear().toString();
  const [listaAnni, setListaAnni] = useState<string[]>([currentAnno]);
  const [selectedAnno, setSelectedAnno] = useState<string | null>(currentAnno);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const getGraphData = async () => {
    const result = await apiFetch.get<GraphApiData[]>("/api/transazioni/spese");
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      setIsLoading(false);
      setListaSpese(result.data);
      const range = getRangeYears(result.data);
      setListaAnni(range.map(String));
      if (!selectedAnno) setSelectedAnno(range[0].toString());
    }
  };

  useEffect(() => {
    const result = listaSpese.filter(
      (element) => element.anno.toString() == selectedAnno
    );
    elaboraDati(result);
  }, [listaSpese, selectedAnno]);

  useEffect(() => {
    setIsLoading(true);
    getGraphData();
  }, []);

  useEffect(() => {
    getGraphData();
  }, [forceRender]);

  function elaboraDati(dati: GraphApiData[]) {
    const graphData: GraphData = {
      colors: [],
      series: [],
      labels: [],
    };
    dati.map((item) => {
      const mantineColor = transazioniIconColor[item.categoria].color;
      const color = parseThemeColor({
        color: mantineColor,
        theme,
        colorScheme,
      }).value;
      graphData.labels.push(item.categoria);
      graphData.series.push(item.totale * -1);
      graphData.colors.push(color);
    });
    setGraphData(graphData);
  }

  const options = listaAnni.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <>
      {isLoading ? (
        <PieChartSkeleton />
      ) : (
        <Stack gap="xs">
          <Center>
            <Group gap={3}>
              <Text fw={500} fz="lg">
                {"Spese per tipologia dell'anno"}
              </Text>
              <Combobox
                store={combobox}
                width={100}
                onOptionSubmit={(val) => {
                  setSelectedAnno(val);
                  combobox.closeDropdown();
                }}
              >
                <Combobox.Target>
                  <Button
                    size="compact-xs"
                    variant="transparent"
                    color="black"
                    px={0}
                    onClick={() => combobox.toggleDropdown()}
                  >
                    <Group gap={2}>
                      <Text fw={500} fz="lg">
                        {selectedAnno}
                      </Text>
                      <ComboboxChevron />
                    </Group>
                  </Button>
                </Combobox.Target>
                <Combobox.Dropdown>
                  <Combobox.Options>{options}</Combobox.Options>
                </Combobox.Dropdown>
              </Combobox>
            </Group>
          </Center>
          <Box pos="relative">
            <ReactApexChart
              options={{
                responsive: [
                  {
                    breakpoint: 768,
                    options: {
                      legend: { position: "bottom" },
                    },
                  },
                ],
                title: {
                  align: "center",
                  margin: 20,
                },
                tooltip: {
                  y: {
                    formatter: (val) => formatValuta(val),
                  },
                },
                labels: graphData.labels,
                colors: graphData.colors,
                plotOptions: {
                  pie: {
                    expandOnClick: false,
                    donut: {
                      labels: {
                        show: true,
                        name: { show: true },
                        value: {
                          show: true,
                          formatter: (val) => formatValuta(Number(val)),
                        },
                        total: {
                          show: true,
                          label: "Spese",
                          formatter: (w) => {
                            const totale = w.globals.seriesTotals.reduce(
                              (a: number, b: number) => {
                                return a + b;
                              },
                              0
                            );
                            return formatValuta(totale);
                          },
                          color: "black",
                        },
                      },
                    },
                  },
                },
              }}
              series={graphData.series}
              type="donut"
              height={350}
              width="100%"
            />
            {graphData.series.length == 0 && (
              <NessunGrafico
                pos="absolute"
                top={0}
                right={0}
                bottom={0}
                left={0}
              />
            )}
          </Box>
        </Stack>
      )}
    </>
  );
}

export default PieChart;

export function PieChartSkeleton() {
  return <Skeleton height={350} />;
}
