import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getServerUser(cookies());
  assert(user);
  try {
    const madreResult = await prisma.soggetto.findMany({
      where: { sesso: false, profileId: user.id },
    });
    const padreResult = await prisma.soggetto.findMany({
      where: { sesso: true, profileId: user.id },
    });

    return NextResponse.json(
      { result: { padre: padreResult, madre: madreResult }, error: false },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 400 }
    );
  }
}
