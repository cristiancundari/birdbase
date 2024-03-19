import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paramsObj = Object.fromEntries(searchParams.entries());

  const page = Number(paramsObj.page) || 1;
  const pageSize = Number(paramsObj.page_size) || 30;

  const count = await prisma.richiestaRegistrazione.count();
  const res = await prisma.richiestaRegistrazione.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    orderBy: [
      {
        approvatoIl: "desc",
      },
      {
        rifiutatoIl: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return NextResponse.json(
    { error: false, result: { richiesteRegistrazione: res, count: count } },
    { status: 200 }
  );
}
