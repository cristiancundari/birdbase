import { getServerUser, getServerUserProfile } from "@/lib/supabase/helper";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { StreamChat } from "stream-chat";
import { z } from "zod";

export async function POST(request: NextRequest) {
  // 1 get the supabase authenticated user ID
  const authUser = await getServerUserProfile(cookies());
  assert(authUser, "Non autorizzato");

  try {
    // 2 send user ID and any other required data to Stream Chat backend
    const apiKey = process.env.NEXT_PUBLIC_STREAM_KEY || "Set API Key";
    const apiSecret = process.env.STREAM_SECRET || "Set API Secret";
    const client = StreamChat.getInstance(apiKey, apiSecret);

    // 3 generate a user token
    const user = {
      name: authUser.allevatore.nome + " " + authUser.allevatore.cognome,
      id: authUser.id,
      role: "user",
    };
    const upsertResponse = await client.upsertUser(user);

    const token = client.createToken(authUser.id);

    return NextResponse.json(
      {
        error: false,
        result: {
          user,
          streamUsers: upsertResponse.users,
          userToken: token,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: true, message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 }
    );
  }
}
