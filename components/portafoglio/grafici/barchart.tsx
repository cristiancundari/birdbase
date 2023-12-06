"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@mantine/core";
import { ApiResponse } from "@/types/types";
import { formatValuta, showNotification } from "@/lib/helper";
import { IncassiQueryResult } from "@/app/api/transazioni/incassi/route";
import { usePortafoglioContext } from "../portafoglioPage";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <BarChartSkeleton />,
});

function BarChart() {
  const { state: forceRender } = usePortafoglioContext();
  const [incassi, setIncassi] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getIncassi = async () => {
    const response = await fetch("/api/transazioni/incassi");
    const result: ApiResponse = await response.json();
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      let series = Array(12).fill(0);
      const dati: IncassiQueryResult[] = result.result;
      dati.forEach((item) => {
        series[item.mese - 1] = item.totale;
      });
      setIsLoading(false);
      setIncassi(series);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getIncassi();
  }, []);

  useEffect(() => {
    getIncassi();
  }, [forceRender]);

  return isLoading ? (
    <BarChartSkeleton />
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
        title: { text: "Incassi ultimi 12 mesi", align: "center", margin: 20 },
        chart: { toolbar: { show: false }, selection: { enabled: false } },
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
          data: incassi,
        },
      ]}
      type="bar"
      height={350}
      width="100%"
    />
  );
}

function BarChartSkeleton() {
  return <Skeleton height={350} />;
}

export default BarChart;
