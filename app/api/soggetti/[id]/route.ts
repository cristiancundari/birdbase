import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { FileWithPath } from "@mantine/dropzone";
import { v4 as uuidv4 } from "uuid";
import { Soggetto } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const datiSchema = z.object({
    preferito: z.boolean().optional(),
    dataNascita: z.coerce.date(),
    sesso: z.boolean().nullable(),
    gabbia: z.coerce.number().nullish(),
    rna: z.string(),
    numero: z.string().min(1),
    avatar: z.string().nullish(),
    isMorto: z.coerce.boolean(),
  });

  try {
    const dati = await request.formData();
    const img = dati.get("imgFile") as FileWithPath;
    const form = JSON.parse(dati.get("form") as string);
    const values = datiSchema.parse(form);

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    let result = null;
    const imgName = `soggetti/${uuidv4()}`;
    if (img) {
      values.avatar = imgName;
    }
    await prisma.$transaction(async (tx) => {
      result = await tx.soggetto.update({
        data: values,
        where: { id: params.id },
      });
      if (img) {
        const upload = await supabase.storage.from("img").upload(imgName, img);
        if (upload.error) {
          throw new Error(upload.error.message);
        }
      }
    });
    return NextResponse.json({ result: result, error: false }, { status: 200 });
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await prisma.soggetto.delete({ where: { id: params.id } });
    return NextResponse.json({ error: false, result: result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await prisma.$queryRaw<
      Soggetto[]
    >`UPDATE "soggetti" SET preferito = not preferito WHERE id=${params.id}::uuid RETURNING *`;
    return NextResponse.json(
      { result: result[0], error: false },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 500 }
    );
  }
}
