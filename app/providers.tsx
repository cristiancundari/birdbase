"use client";

import { Box, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";
import theme from "./mantine-theme";

type Props = {
  children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <SessionProvider>
      <MantineProvider defaultColorScheme="light" theme={theme}>
        <Notifications position="bottom-right" zIndex={1000} />
        <Box>{children}</Box>
      </MantineProvider>
    </SessionProvider>
  );
};
