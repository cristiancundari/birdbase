import { getServerUserProfile } from "@/lib/supabase/helper";
import { createClient } from "@/lib/supabase/server";
import SupabaseProvider from "@/providers/SupabaseProvider";
import "dayjs/locale/it";
import { cookies } from "next/headers";
import LayoutProviders from "./LayoutWrapper";
import { PropsWithChildren } from "react";

export const SupabaseWrapper = async ({ children }: PropsWithChildren) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const authUser = await getServerUserProfile(cookieStore);

  return (
    <SupabaseProvider session={session} user={authUser}>
      <LayoutProviders>{children}</LayoutProviders>
    </SupabaseProvider>
  );
};
