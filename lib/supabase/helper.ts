import { Ruolo } from "@/types/types";
import { createClient } from "./server";
import { NextResponse } from "next/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { SupabaseClient } from "@supabase/supabase-js";

export async function checkAdmin(cookieStore: ReadonlyRequestCookies) {
  const user = await getServerUser(cookieStore);
  const isAdmin = user?.role == Ruolo.Admin;
  if (!isAdmin) {
    throw new Error("L'utente non è un admin");
  }
}

export async function getServerUser(cookieStore: ReadonlyRequestCookies) {
  const supabase = createClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user;
}
