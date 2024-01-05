"use client";

import { createClient } from "@/lib/supabase/client";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, useState } from "react";

type MaybeSession = Session | null;

type SupabaseContext = {
  client: SupabaseClient;
  session: MaybeSession;
  isAdmin: boolean;
};

// @ts-ignore
const Context = createContext<SupabaseContext>();

export default function SupabaseProvider({
  children,
  session,
  isAdmin,
}: {
  children: React.ReactNode;
  session: MaybeSession;
  isAdmin: boolean;
}) {
  const [client] = useState(() => createClient());

  return (
    <Context.Provider value={{ client, session, isAdmin }}>
      <>{children}</>
    </Context.Provider>
  );
}

export const useSupabase = () => useContext(Context);
