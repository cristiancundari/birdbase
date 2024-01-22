import { getServerUserProfile } from "@/lib/supabase/helper";
import { createClient } from "@/lib/supabase/server";
import SupabaseProvider from "@/providers/supabaseProvider";
import { Role } from "@prisma/client";
import "dayjs/locale/it";
import { cookies } from "next/headers";
import LayoutProviders from "./layoutProviders";

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
      <LayoutProviders>{children}</LayoutProviders>
    </SupabaseProvider>
  );
};
