import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
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
    dataNascita: z.coerce.date().optional(),
    sesso: z.boolean().nullable().optional(),
    gabbia: z.coerce.number().nullish().optional(),
    rna: z.string().optional(),
    numero: z.string().min(1).optional(),
    anno: z.string().min(1).optional(),
    avatar: z.string().nullish().optional(),
    isMorto: z.coerce.boolean().optional(),
    note: z.string().optional(),
    covataId: z.coerce
      .number()
      .transform((v) => v || null)
      .optional(),
  });

  try {
    const cookieStore = cookies();
    const user = await getServerUser(cookieStore);
    assert(user, "Non autorizzato");

    const dati = await request.formData();
    const imgFile = dati.get("imgFile") as FileWithPath;
    const form = JSON.parse(dati.get("form") as string);
    const values = datiSchema.parse(form);

    //otteniamo il soggetto da modificare
    const soggetto = await prisma.soggetto.findFirst({
      where: { id: params.id },
    });
    if (!soggetto) {
      throw new Error("Il soggetto non esiste");
    }

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

      if (values.covataId && soggetto.covataId != values.covataId) {
        //otteniamo la covata
        const covata = await tx.covata.findFirstOrThrow({
          where: { id: values.covataId },
          include: { _count: { select: { figli: true } } },
        });
        if (covata.uovaDeposte < covata._count.figli) {
          throw new Error("La covata non può avere altri figli");
        }
        if (covata.uovaDeposte == covata._count.figli) {
          await tx.covata.update({
            where: { id: covata.id },
            data: { completata: true },
          });
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
