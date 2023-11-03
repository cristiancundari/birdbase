"use client";
import { ModalsProvider } from "@mantine/modals";
import { Box, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";
import theme from "./mantine-theme";
import { DatesProvider } from "@mantine/dates";
import "dayjs/locale/it";

type Props = {
  children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <SessionProvider>
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
    </SessionProvider>
  );
};
