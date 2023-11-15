import Gara from "@/components/gare/gara";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { FileWithPath } from "@mantine/dropzone";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const datiSchema = z.object({
    titolo: z.string().min(1),
    citta: z.string().min(1),
    dataEvento: z.coerce.date(),
    tipologia: z.string(),
    nazioneId: z.coerce.number(),
    prezzo: z.coerce.number().min(0),
    capienza: z.coerce.number().min(1),
    immagine: z.string().nullish(),
  });

  try {
    const dati = await request.formData();
    const form = JSON.parse(dati.get("form") as string);
    const img = dati.get("imgFile") as FileWithPath;
    const values = datiSchema.parse(form);
    let update = null;
    // definiamo il nome dell'immagine da salvare sul db
    const imgName = uuidv4();
    if (img) {
      values.immagine = imgName;
    }
    // transazione update gara, immagine
    await prisma.$transaction(async (tx) => {
      // effettuiamo la modifica sul db della gara
      update = await tx.gara.update({
        data: values,
        where: { id: params.id },
      });
      // effettuiamo l'update dell'immagine
      if (img) {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);
        const uploadImg = await supabase.storage
          .from("img")
          .upload(imgName, img);
        // generiamo l'errore per essere catturato dal catch
        if (uploadImg.error) {
          throw new Error(uploadImg.error.message);
        }
      }
    });
    return NextResponse.json({ result: update, error: false }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 400 }
    );
  }
}
