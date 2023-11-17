import { Ruolo } from "@/types/types";
import { createClient } from "./supabase/server";
import { NextResponse } from "next/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function checkAdmin(cookieStore: ReadonlyRequestCookies) {
  const supabase = createClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const admin = session?.user.role == Ruolo.Admin;
  if (!admin) {
    throw new Error("L'utente non è un admin");
  }
}
