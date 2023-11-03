import { ModalsProvider } from "@mantine/modals";
import { Box, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import theme from "./mantine-theme";
import { DatesProvider } from "@mantine/dates";
import "dayjs/locale/it";
import SupabaseProvider from "@/providers/supabaseProvider";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

type Props = {
  children?: React.ReactNode;
};

export const Providers = async ({ children }: Props) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <SupabaseProvider session={session}>
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
    </SupabaseProvider>
  );
};
