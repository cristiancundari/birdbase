"use client";
import { Box, MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "dayjs/locale/it";
import theme from "../lib/mantine-theme";
import { PropsWithChildren } from "react";

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
          <Box>{children}</Box>
        </ModalsProvider>
      </DatesProvider>
    </MantineProvider>
  );
}

export default LayoutProviders;
