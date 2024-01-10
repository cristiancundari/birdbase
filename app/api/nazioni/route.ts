import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const nazioni = await prisma.nazione.findMany();
    return NextResponse.json(
      { error: false, result: nazioni },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 }
    );
  }
}
