import { prisma } from "@/lib/prisma";
import { createServiceClient } from "@/lib/supabase/service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { uuid } from "uuidv4";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const datiObj = Object.fromEntries(formData.entries());

  const datiSchema = z.object({
    nome: z.string(),
    cognome: z.string(),
    rna: z.string(),
    email: z.string().email(),
    documentoIdentita: z.instanceof(File),
    documentoIscrizione: z.instanceof(File),
  });

  try {
    const datiParsed = datiSchema.parse(datiObj);

    const maxFileSize = 5 * 1024 * 1024;
    if (
      datiParsed.documentoIdentita.size > maxFileSize ||
      datiParsed.documentoIscrizione.size > maxFileSize
    ) {
      throw new Error(
        "I file superano la dimensione massima consentita di 5MB"
      );
    }

    const docIdentitaPath = `identita/${uuid()}`;
    const docFoiPath = `foi/${uuid()}`;

    const supabase = createServiceClient(cookies());
    const upload1 = await supabase.storage
      .from("documents")
      .upload(docIdentitaPath, datiParsed.documentoIdentita);
    if (upload1.error) {
      throw new Error(
        "L'upload non è andato a buon fine. " + upload1.error.message
      );
    }

    const upload2 = await supabase.storage
      .from("documents")
      .upload(docFoiPath, datiParsed.documentoIscrizione);
    if (upload2.error) {
      throw new Error(
        "L'upload non è andato a buon fine. " + upload2.error.message
      );
    }

    const res = await prisma.richiestaRegistrazione.create({
      data: {
        nome: datiParsed.nome,
        cognome: datiParsed.cognome,
        rna: datiParsed.rna,
        email: datiParsed.email,
        docIdentita: docIdentitaPath,
        docFoi: docFoiPath,
      },
    });

    return NextResponse.json({ error: false, result: res }, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: true, message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: true, message: "Internal server error. " + error.message },
      { status: 500 }
    );
  }

  // ... save to database
  return {
    status: 200,
    body: {
      message: "Registrazione presa in carico",
    },
  };
}
