"use client";
import { Box, MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "dayjs/locale/it";
import theme from "./mantine-theme";

type Props = {
  children?: React.ReactNode;
};

function LayoutProviders({ children }: Props) {
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
