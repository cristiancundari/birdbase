import { FormValues } from "@/components/gare/ModalGara";
import { prisma } from "@/lib/prisma";
import { getServerUserProfile } from "@/lib/supabase/helper";
import { createClient } from "@/lib/supabase/server";
import { FileWithPath } from "@mantine/dropzone";
import { $Enums, Gara, Prisma, Role } from "@prisma/client";
import assert from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { uuid } from "uuidv4";
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
    stato: z.nativeEnum($Enums.GaraStatus),
  });

  try {
    const cookieStore = cookies();
    const userProfile = await getServerUserProfile(cookieStore);
    assert(userProfile, "Non autorizzato");

    const isAdmin = userProfile.ruolo == Role.ADMIN;
    if (!isAdmin) {
      throw new Error("Non autorizzato");
    }

    const dati: FormData = await request.formData();
    const formJSON = dati.get("form") as string;
    const imgFile = dati.get("imgFile") as FileWithPath;
    const form: FormValues = JSON.parse(formJSON);
    const values = datiSchema.parse(form);

    const imgName = `gare/${uuid()}`;

    const result = await prisma.$transaction(async (tx) => {
      const res = await tx.gara.create({
        data: { ...values, immagine: imgFile ? imgName : null },
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

export async function GET(request: NextRequest) {
  try {
    const userProfile = await getServerUserProfile(cookies());
    assert(userProfile, "Non autorizzato");

    const isAdmin = userProfile.ruolo == Role.ADMIN;

    //Se l'utente è un amministratore ottieni tutte le gare.
    const adminCondition: Prisma.GaraWhereInput = {};
    //Se l'utente NON è un amministratore escludi le gare eliminate e le bozze.
    const userCondition: Prisma.GaraWhereInput = {
      isDeleted: false,
      stato: { not: "BOZZA" },
    };

    const gare = await prisma.gara.findMany({
      include: { nazione: true, _count: { select: { iscrizioni: true } } },
      where: isAdmin ? adminCondition : userCondition,
      orderBy: [{ isDeleted: "asc" }, { data: "asc" }],
    });

    return NextResponse.json({ result: gare, error: false }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 }
    );
  }
}
