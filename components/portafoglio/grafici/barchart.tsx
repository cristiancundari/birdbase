"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@mantine/core";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <Skeleton height={350} />,
});

interface BarChartProps {
  series: (number | null)[];
}
function BarChart({ series }: BarChartProps) {
  return (
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
        title: { text: "Ricavi ultimi 12 mesi", align: "center", margin: 20 },
        chart: { toolbar: { show: false }, selection: { enabled: false } },
        tooltip: {
          y: {
            formatter: (val) => `€ ${val}`,
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
          formatter: (val) => `€ ${val}`,
          offsetY: -20,
          style: {
            fontSize: "10px",
            colors: ["#304758"],
          },
        },
        xaxis: {
          axisTicks: { show: false },
        },
      }}
      series={[
        {
          name: "Profitto",
          data: series,
        },
      ]}
      type="bar"
      height={350}
      width="100%"
    />
  );
}

export default BarChart;
