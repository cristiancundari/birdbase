import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import { createClient } from "@/lib/supabase/server";
import { FileWithPath } from "@mantine/dropzone";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { uuid } from "uuidv4";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser(cookies());
    assert(user, "Non autorizzato");
    //TODO: verificare ordinamento per isMorto (boolean)
    const result = await prisma.soggetto.findMany({
      where: { profiloId: user.id },
      orderBy: [{ isMorto: "desc" }, { dataNascita: "desc" }],
    });

    return NextResponse.json({ result: result, error: false }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  const datiSchema = z.object({
    preferito: z.boolean().optional(),
    dataNascita: z.coerce.date(),
    sesso: z.boolean().nullable(),
    gabbia: z.coerce.number().nullish(),
    rna: z.string(),
    numero: z.string().min(1),
    avatar: z.string().nullish(),
    isMorto: z.coerce.boolean(),
    covataId: z.coerce.number().optional(),
  });

  try {
    const cookieStore = cookies();
    const user = await getServerUser(cookieStore);
    assert(user, "Non autorizzato");

    const dati = await request.formData();
    const formJSON = dati.get("form") as string;
    const imgFile = dati.get("imgFile") as FileWithPath;
    const form = JSON.parse(formJSON);
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
    const imgName = `soggetti/${uuid()}`;

    if (imgFile) {
      values.avatar = imgName;
    }
    const result = await prisma.$transaction(async (tx) => {
      const res = await tx.soggetto.create({
        data: { ...values, profiloId: user.id },
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
      return res;
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
