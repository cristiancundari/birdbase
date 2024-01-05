import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { FileWithPath } from "@mantine/dropzone";
import { uuid } from "uuidv4";
import { Soggetto } from "@prisma/client";
import { getServerUser } from "@/lib/supabase/helper";
import assert from "assert";

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
    const cookieStore = cookies();
    const user = await getServerUser(cookieStore);
    assert(user, "Non autorizzato");

    const dati = await request.formData();
    const imgFile = dati.get("imgFile") as FileWithPath;
    const form = JSON.parse(dati.get("form") as string);
    const values = datiSchema.parse(form);

    let result: Soggetto | null = null;
    const imgName = `soggetti/${uuid()}`;
    if (imgFile) {
      values.avatar = imgName;
    }
    await prisma.$transaction(async (tx) => {
      result = await tx.soggetto.update({
        data: values,
        where: { id: params.id, profiloId: user.id },
      });
      if (imgFile) {
        const supabase = createClient(cookieStore);
        const upload = await supabase.storage
          .from("img")
          .upload(imgName, imgFile);
        if (upload.error) {
          throw new Error("L'upload non è andato a buon fine");
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
    const user = await getServerUser(cookies());
    assert(user, "Non autorizzato");

    const result = await prisma.soggetto.delete({
      where: { id: params.id, profiloId: user.id },
    });
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
    const user = await getServerUser(cookies());
    assert(user, "Non autorizzato");

    const result = await prisma.$queryRaw<
      Soggetto[]
    >`UPDATE "soggetti" SET preferito = not preferito WHERE id=${params.id}::uuid AND profilo_id=${user.id}::uuid RETURNING *`;
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
