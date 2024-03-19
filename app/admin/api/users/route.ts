import { prisma } from "@/lib/prisma";
import { createServiceClient } from "@/lib/supabase/service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paramsObj = Object.fromEntries(searchParams.entries());

  const page = Number(paramsObj.page) || 1;
  const pageSize = Number(paramsObj.page_size) || 30;

  const supabase = createServiceClient(cookies());
  const res = await supabase.auth.admin.listUsers({
    perPage: pageSize,
    page: page,
  });
  if (res.error) {
    return NextResponse.json(
      {
        error: true,
        message:
          "Si è verificato un errore durante il caricamento degli utenti",
      },
      { status: 500 }
    );
  }

  const users = await prisma.profilo.findMany({
    where: {
      id: {
        in: res.data.users.map((u) => u.id),
      },
    },
    include: {
      allevatore: true,
    },
  });

  return NextResponse.json(
    {
      error: false,
      result: {
        users: users,
        pagination: {
          lastPage: res.data.lastPage,
          nextPage: res.data.nextPage,
          total: res.data.total,
        },
      },
    },
    { status: 200 }
  );
}
