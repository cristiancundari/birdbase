"use client";

import { createClient } from "@/lib/supabase/client";
import { Session } from "@supabase/gotrue-js";
import { SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, useState } from "react";

type MaybeSession = Session | null;

type SupabaseContext = {
  client: SupabaseClient;
  session: MaybeSession;
};

// @ts-ignore
const Context = createContext<SupabaseContext>();

export default function SupabaseProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: MaybeSession;
}) {
  const [client] = useState(() => createClient());

  return (
    <Context.Provider value={{ client, session }}>
      <>{children}</>
    </Context.Provider>
  );
}

export const useSupabase = () => useContext(Context);
