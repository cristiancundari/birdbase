"use client";
import { Box, MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "dayjs/locale/it";
import theme from "../lib/mantine-theme";
import { PropsWithChildren } from "react";
import NextTopLoader from "nextjs-toploader";

function LayoutProviders({ children }: PropsWithChildren) {
  return (
    <MantineProvider defaultColorScheme="light" theme={theme}>
      <DatesProvider
        settings={{
          locale: "it",
          timezone: "UTC",
        }}
      >
        <ModalsProvider>
          <Notifications position="bottom-right" zIndex={1000} />
          <NextTopLoader color="var(--mantine-primary-color-5)" height={5} />
          <Box>{children}</Box>
        </ModalsProvider>
      </DatesProvider>
    </MantineProvider>
  );
}

export default LayoutProviders;
