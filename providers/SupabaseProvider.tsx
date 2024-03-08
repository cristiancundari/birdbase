"use client";

import { createClient } from "@/lib/supabase/client";
import { ProfiloWithAllevatore } from "@/types/types";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, useState } from "react";

type MaybeSession = Session | null;

type SupabaseContext = {
  client: SupabaseClient;
  session: MaybeSession;
  user: ProfiloWithAllevatore | null;
};

// @ts-ignore
const Context = createContext<SupabaseContext>();

interface SupabaseProviderProps {
  children: React.ReactNode;
  session: MaybeSession;
  user: ProfiloWithAllevatore | null;
}
export default function SupabaseProvider({
  children,
  session,
  user,
}: SupabaseProviderProps) {
  const [client] = useState(() => createClient());

  return (
    <Context.Provider value={{ client, session, user }}>
      <>{children}</>
    </Context.Provider>
  );
}

export const useSupabase = () => useContext(Context);
