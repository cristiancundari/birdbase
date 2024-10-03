import { NextRequest, NextResponse } from "next/server";
import { createoAuth2Client } from "@/lib/helper";

export async function GET(request: NextRequest) {
    const oAuth2Client = createoAuth2Client();
    const url = oAuth2Client.generateAuthUrl({access_type: "offline", scope: [
        "https://www.googleapis.com/auth/calendar"
    ]})

    return NextResponse.redirect(url)
}