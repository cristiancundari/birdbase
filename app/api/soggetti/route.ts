import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Sesso } from "@/types/types";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { FileWithPath } from "@mantine/dropzone";
import assert from "assert";
import { getServerUser } from "@/lib/supabase/helper";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const session = await supabase.auth.getSession();
  const user = session.data.session?.user;

  const datiSchema = z.object({
    preferito: z.boolean().optional(),
    dataNascita: z.coerce.date(),
    sesso: z.boolean().nullable(),
    gabbia: z.coerce.number().nullish(),
    rna: z.string(),
    numero: z.string().min(1),
    avatar: z.string().nullish(),
  });

  try {
    assert(user, "E' necessaria l'autenticazione");
    const dati = await request.formData();
    const img = dati.get("imgFile") as FileWithPath;
    const form = JSON.parse(dati.get("form") as string);
    const values = datiSchema.parse(form);

    const controllo = await prisma.soggetto.findFirst({
      where: { numero: values.numero, rna: values.rna },
    });
    if (controllo) {
      return NextResponse.json(
        { error: true, message: "Il soggetto è già presente" },
        { status: 400 }
      );
    }
    const imgName = `soggetti/${uuidv4()}`;
    let result = null;

    if (img) {
      values.avatar = imgName;
    }

    await prisma.$transaction(async (tx) => {
      result = await tx.soggetto.create({
        data: { ...values, profiloId: user.id },
      });
      if (img) {
        const upload = await supabase.storage.from("img").upload(imgName, img);
        if (upload.error) {
          throw new Error("L'upload non è andato a buon fine");
        }
      }
    });
    return NextResponse.json({ result: result, error: false }, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.message, error: true },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { message: error.message, error: true },
        { status: 500 }
      );
    }
  }
}

export async function GET(request: NextRequest) {
  const user = await getServerUser(cookies());
  assert(user);
  try {
    const result = await prisma.soggetto.findMany({
      where: { profiloId: user.id },
      orderBy: { dataNascita: "desc" },
    });

    return NextResponse.json({ result: result, error: false }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 400 }
    );
  }
}
