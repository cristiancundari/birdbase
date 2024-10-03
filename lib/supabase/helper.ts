import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { prisma } from "../prisma";
import { createClient } from "./server";

export async function getServerUserProfile(
  cookieStore: ReadonlyRequestCookies
) {
  const user = await getServerUser(cookieStore);

  const profile = await prisma.profilo.findFirst({
    where: {
      id: user?.id,
    },
    include: { allevatore: true },
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

