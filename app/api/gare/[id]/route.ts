import GaraCard from "@/components/gare/GaraCard";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { FileWithPath } from "@mantine/dropzone";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { uuid } from "uuidv4";
import { getServerUserProfile } from "@/lib/supabase/helper";
import { $Enums, Role } from "@prisma/client";
import assert from "assert";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const datiSchema = z.object({
    titolo: z.string().min(1),
    citta: z.string().min(1),
    data: z.coerce.date(),
    tipologia: z.string(),
    nazioneId: z.coerce.number(),
    prezzo: z.coerce.number().min(0),
    capienza: z.coerce.number().min(1),
    immagine: z.string().nullish(),
    stato: z.nativeEnum($Enums.GaraStatus),
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

    let createdAt: Date | undefined = undefined;
    const gara = await prisma.gara.findFirst({ where: { id: params.id } });

    if (
      gara?.stato !== $Enums.GaraStatus.BOZZA &&
      values.stato === $Enums.GaraStatus.BOZZA
    ) {
      // Se si vuole reimpostare una gara già precedentemente pubblicata a bozza:
      return NextResponse.json(
        {
          message: "Impossibile modificare in bozza una gara già pubblicata",
          error: true,
        },
        { status: 400 }
      );
    }
    if (
      gara?.stato === $Enums.GaraStatus.BOZZA &&
      values.stato !== $Enums.GaraStatus.BOZZA
    ) {
      // Se si sta pubblicando una gara, modifichiamo il campo createdAt in modo che rappresenti la data di pubblicazione:
      createdAt = new Date();
    }

    const imgName = `gare/${uuid()}`;
    if (imgFile) {
      values.immagine = imgName;
    }

    const result = await prisma.$transaction(async (tx) => {
      const res = await tx.gara.update({
        data: { ...values, createdAt: createdAt },
        where: { id: params.id },
      });

      if (imgFile) {
        const supabase = createClient(cookieStore);
        const uploadImg = await supabase.storage
          .from("img")
          .upload(imgName, imgFile);

        if (uploadImg.error) {
          // Se l'upload non è andato a buon fine eseguiamo il rollback generando un errore
          throw new Error(uploadImg.error.message);
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const res = await prisma.gara.findUniqueOrThrow({
      where: { id: params.id },
      include: {
        iscrizioni: {
          include: {
            soggetto: {},
            profilo: { include: { allevatore: true } },
          },
        },
      },
    });
    return NextResponse.json({ error: false, result: res }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 400 }
    );
  }
}
