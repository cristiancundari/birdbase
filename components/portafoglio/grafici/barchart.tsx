"use client";
import { apiFetch } from "@/lib/apiFetch";
import { formatValuta, getRangeYears, showNotification } from "@/lib/helper";
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
  useCombobox,
} from "@mantine/core";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePortafoglioContext } from "../portafoglioPage";
import NessunGrafico from "./NessunGrafico";
import { IncassoQueryResult } from "@/types/types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <BarChartSkeleton />,
});

function BarChart() {
  const { state: forceRender } = usePortafoglioContext();
  const [incassi, setIncassi] = useState<IncassoQueryResult[]>([]);
  const [incassiAnnui, setIncassiAnnui] = useState<number[]>([]);
  const [listaAnni, setListaAnni] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState<string | null>(
    new Date().getFullYear().toString()
  );
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const incassiToSeries = (incassi: IncassoQueryResult[]) => {
    const incassiAnnui = incassi.filter(
      (incasso) => incasso.anno.toString() == selectedItem
    );
    let series = Array(12).fill(0);
    incassiAnnui.forEach((item) => {
      series[item.mese - 1] = item.totale;
    });
    return series;
  };

  const getIncassi = async () => {
    const result = await apiFetch.get<IncassoQueryResult[]>(
      "/api/transazioni/incassi"
    );
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      setIncassi(result.data);
      const range = getRangeYears(result.data);
      setListaAnni(range.map(String));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const series = incassiToSeries(incassi);
    setIncassiAnnui(series);
  }, [selectedItem, incassi]);

  useEffect(() => {
    setIsLoading(true);
    getIncassi();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      getIncassi();
    }
  }, [forceRender]);

  const options = listaAnni.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return isLoading ? (
    <BarChartSkeleton />
  ) : (
    <Stack>
      <Center>
        <Group gap={3}>
          <Text fw={500} fz="lg">
            {"Incassi dell'anno"}
          </Text>
          <Combobox
            store={combobox}
            width={100}
            onOptionSubmit={(val) => {
              setSelectedItem(val);
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
                    {selectedItem}
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
      <Box pos="relative" h={350}>
        {incassiAnnui.every((item) => item == 0) ? (
          <NessunGrafico pos="absolute" top={0} right={0} bottom={0} left={0} />
        ) : (
          <ReactApexChart
            options={{
              responsive: [
                {
                  breakpoint: 768,
                  options: {
                    plotOptions: {
                      bar: { borderRadius: 2, horizontal: true },
                    },
                    dataLabels: {
                      offsetY: 0,
                      offsetX: 20,
                    },
                  },
                },
              ],
              //title: { text: "Incassi ultimi 12 mesi", align: "center", margin: 20 },
              chart: {
                toolbar: { show: false },
                selection: { enabled: false },
              },
              tooltip: {
                y: {
                  formatter: (val) => formatValuta(val),
                },
              },
              labels: [
                "Gen",
                "Feb",
                "Mar",
                "Apr",
                "Mag",
                "Giu",
                "Lug",
                "Ago",
                "Set",
                "Ott",
                "Nov",
                "Dic",
              ],
              plotOptions: {
                bar: { borderRadius: 10, dataLabels: { position: "top" } },
              },
              dataLabels: {
                formatter: (val) => formatValuta(Number(val)),
                offsetY: -20,
                style: {
                  fontSize: "10px",
                  colors: ["#304758"],
                },
              },
              xaxis: {
                axisTicks: { show: false },
                labels: {
                  rotate: -45,
                  rotateAlways: true,
                },
              },
            }}
            series={[
              {
                name: "Profitto",
                data: incassiAnnui,
              },
            ]}
            type="bar"
            height="100%"
            width="100%"
          />
        )}
      </Box>
    </Stack>
  );
}

function BarChartSkeleton() {
  return <Skeleton height={350} />;
}

export default BarChart;
