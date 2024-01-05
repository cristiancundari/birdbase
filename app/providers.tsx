import { ModalsProvider } from "@mantine/modals";
import { Box, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import theme from "./mantine-theme";
import { DatesProvider } from "@mantine/dates";
import "dayjs/locale/it";
import SupabaseProvider from "@/providers/supabaseProvider";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getServerUserProfile } from "@/lib/supabase/helper";
import { Role } from "@prisma/client";

type Props = {
  children?: React.ReactNode;
};

export const Providers = async ({ children }: Props) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userProfile = await getServerUserProfile(cookieStore);
  const isAdmin = userProfile?.ruolo === Role.ADMIN;

  return (
    <SupabaseProvider session={session} isAdmin={isAdmin}>
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
