import Gara from "@/components/gare/gara";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { FileWithPath } from "@mantine/dropzone";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { uuid } from "uuidv4";
import { getServerUserProfile } from "@/lib/supabase/helper";
import { Role } from "@prisma/client";
import assert from "assert";

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
    const cookieStore = cookies();
    const userProfile = await getServerUserProfile(cookieStore);
    assert(userProfile, "Non autorizzato");

    if (userProfile?.ruolo !== Role.ADMIN) {
      throw new Error("Non autorizzato");
    }

    const dati = await request.formData();
    const formJSON = dati.get("form") as string;
    const imgFile = dati.get("imgFile") as FileWithPath;
    const form = JSON.parse(formJSON);
    const values = datiSchema.parse(form);

    // definiamo il nome dell'immagine da salvare sul db
    const imgName = `gare/${uuid()}`;
    if (imgFile) {
      values.immagine = imgName;
    }
    // transazione update gara, immagine
    const result = await prisma.$transaction(async (tx) => {
      // effettuiamo la modifica sul db della gara
      const res = await tx.gara.update({
        data: values,
        where: { id: params.id },
      });
      // effettuiamo l'update dell'immagine
      if (imgFile) {
        const supabase = createClient(cookieStore);
        const uploadImg = await supabase.storage
          .from("img")
          .upload(imgName, imgFile);
        // generiamo l'errore per essere catturato dal catch
        if (uploadImg.error) {
          throw new Error(uploadImg.error.message);
        }
      }
      return res;
    });
    return NextResponse.json({ result: result, error: false }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const datiSchema = z.object({
    id: z.string().min(1),
  });
  try {
    const userProfile = await getServerUserProfile(cookies());
    assert(userProfile, "Non autorizzato");

    if (userProfile?.ruolo !== Role.ADMIN) {
      throw new Error("Non autorizzato");
    }

    const values = datiSchema.parse(params);
    const result = await prisma.gara.update({
      data: { isDeleted: true },
      where: { id: values.id },
    });

    return NextResponse.json({ result: result, error: false }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 500 }
    );
  }
}
