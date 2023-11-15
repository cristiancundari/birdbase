import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest) {
    const nazioni = await prisma.nazione.findMany();
    return NextResponse.json({ error: false, result: nazioni }, { status: 200 });
}