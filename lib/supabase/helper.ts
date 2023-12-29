import { createClient } from "./server";
import { NextResponse } from "next/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { SupabaseClient } from "@supabase/supabase-js";
import { prisma } from "../prisma";
import assert from "assert";
import { Prisma, Role } from "@prisma/client";

export async function getServerUserProfile(
  cookieStore: ReadonlyRequestCookies
) {
  const user = await getServerUser(cookieStore);
  assert(user);
  const profile = await prisma.profilo.findFirst({
    where: {
      id: user.id,
      ruolo: Role.ADMIN,
    },
  });

  return profile;
}

export async function getServerUser(cookieStore: ReadonlyRequestCookies) {
  const supabase = createClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user;
}
