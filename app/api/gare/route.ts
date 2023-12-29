import { FormValues } from "@/components/gare/modalGara";
import { prisma } from "@/lib/prisma";
import { getServerUserProfile } from "@/lib/supabase/helper";
import { createClient } from "@/lib/supabase/server";
import { FileWithPath } from "@mantine/dropzone";
import { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const datiSchema = z.object({
    titolo: z.string().min(1),
    citta: z.string().min(1),
    data: z.coerce.date(),
    tipologia: z.string(),
    nazioneId: z.coerce.number(),
    prezzo: z.coerce.number().min(0),
    capienza: z.coerce.number().min(1),
  });

  try {
    const cookieStore = cookies();
    const profile = await getServerUserProfile(cookieStore);
    if (profile?.ruolo !== Role.ADMIN) {
      throw new Error("Non autorizzato");
    }

    const supabase = createClient(cookieStore);

    const data: FormData = await request.formData();
    const formJSON = data.get("form") as string;
    const dati: FormValues = JSON.parse(formJSON);
    const imgFile = data.get("imgFile") as FileWithPath;

    const imgName = uuidv4();

    const values = datiSchema.parse(dati);

    const result = await prisma.$transaction(async (tx) => {
      const res = await tx.gara.create({
        data: { ...values, immagine: imgFile ? imgName : null },
      });
      const upload = await supabase.storage
        .from("img")
        .upload(imgName, imgFile);
      if (upload.error) {
        throw new Error("Upload error");
      }
      return res;
    });

    return NextResponse.json({ result: result, error: false }, { status: 200 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { message: err.message, error: true },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { message: err.message, error: true },
        { status: 500 }
      );
    }
  }
}
