"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Skeleton,
  parseThemeColor,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  formatValuta,
  showNotification,
  transazioniIconColor,
} from "@/lib/helper";
import { ApiResponse } from "@/types/types";
import { CategoriaSpesa } from "@prisma/client";
import { usePortafoglioContext } from "../portafoglioPage";
import { apiFetch } from "@/lib/apiFetch";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <PieChartSkeleton />,
});

interface GraphApiData {
  categoria: CategoriaSpesa;
  totale: number;
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
  const [graphData, setGraphData] = useState<GraphData>({
    colors: [],
    series: [],
    labels: [],
  });

  const getGraphData = async () => {
    const result = await apiFetch.get("/api/transazioni/spese");
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      setIsLoading(false);
      elaboraDati(result.data);
    }
  };

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
      const mantineColor = transazioniIconColor[item.categoria.nome].color;
      const color = parseThemeColor({
        color: mantineColor,
        theme,
        colorScheme,
      }).value;
      graphData.labels.push(item.categoria.nome);
      graphData.series.push(item.totale);
      graphData.colors.push(color);
    });
    setGraphData(graphData);
  }

  return (
    <>
      {isLoading ? (
        <PieChartSkeleton />
      ) : (
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
              text: "Spese 2023 per tiologia",
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
      )}
    </>
  );
}

export default PieChart;

export function PieChartSkeleton() {
  return <Skeleton height={350} />;
}
