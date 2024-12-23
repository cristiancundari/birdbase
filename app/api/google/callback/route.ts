import { prisma } from "@/lib/prisma";
import { getServerUserProfile } from "@/lib/supabase/helper";
import assert from "assert";
import { createoAuth2Client } from "@/lib/googleapis";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const cookieStore = cookies();
  const userProfile = await getServerUserProfile(cookieStore);
  assert(userProfile, "Non autorizzato");
  const oAuth2Client = createoAuth2Client();

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (code == null) {
    return NextResponse.redirect(requestUrl.origin + "/app/home");
  }

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  const res = await prisma.profilo.update({
    where: {
      id: userProfile.id,
    },
    data: {
      googleRefreshToken: tokens.refresh_token,
    },
  });

  return NextResponse.redirect(requestUrl.origin + "/app/impostazioni");
}
