import { prisma } from "@/lib/prisma";
import { createServiceClient } from "@/lib/supabase/service";
import { AuthError } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { assert } from "console";

function capitalizeWords(inputString: string) {
  return inputString
    .trim()
    .split(" ")
    .filter((w) => w.length > 0)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export async function POST(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const numId = Number(id);
  if (isNaN(numId)) {
    return NextResponse.json(
      { error: true, message: "ID non valido" },
      { status: 400 }
    );
  }

  const dataSchema = z.object({
    status: z.enum(["approved", "rejected"]),
    spiegazione: z.string().optional(),
  });
  try {
    const data = await request.json();
    const datiParsed = dataSchema.parse(data);
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (datiParsed.status === "approved") {
      // Approve
      const res = await prisma.richiestaRegistrazione.update({
        where: {
          id: numId,
          rifiutatoIl: null,
        },
        data: {
          approvatoIl: new Date(),
          spiegazione: datiParsed.spiegazione,
        },
      });
      if (!res) {
        return NextResponse.json(
          { error: true, message: "ID non valido" },
          { status: 400 }
        );
      }
      const pwd = Math.random().toString(36).slice(-8);
      const supabase = createServiceClient(cookies());
      const authUser = await supabase.auth.admin.createUser({
        email: res.email,
        password: pwd,
        email_confirm: true,
      });
      if (authUser.error) {
        return NextResponse.json(
          { error: true, message: authUser.error.message },
          { status: 500 }
        );
      }
      const allevatore = await prisma.allevatore.upsert({
        create: {
          rna: res.rna.toUpperCase(),
          nome: capitalizeWords(res.nome),
          cognome: capitalizeWords(res.cognome),
        },
        update: {
          nome: capitalizeWords(res.nome),
          cognome: capitalizeWords(res.cognome),
        },
        where: {
          rna: res.rna.toUpperCase(),
        },
      });
      const profilo = await prisma.profilo.create({
        data: {
          id: authUser.data.user.id,
          rna: res.rna.toUpperCase(),
        },
      });

      const emailRes = await resend.emails.send({
        from: "noreply@cristiansmarthome.loan",
        to: authUser.data.user.email || "",
        subject: "Birdbase - Welcome! 🎉",
        html:
          "<p>Benvenuto su Birdbase.</p><p>La tua richiesta di registrazione è stata approvata.</p><p>Le tue credenziali di accesso sono:</p><p>Email: " +
          res.email +
          "</p><p>Password: " +
          pwd +
          "</p>" +
          datiParsed.spiegazione
            ? `<p>Messaggio dell'amministratore: ${datiParsed.spiegazione}</p>`
            : "",
      });

      return NextResponse.json({ error: false, result: res }, { status: 200 });
    } else {
      // Reject
      const res = await prisma.richiestaRegistrazione.update({
        where: {
          id: numId,
          approvatoIl: null,
        },
        data: {
          rifiutatoIl: new Date(),
          spiegazione: datiParsed.spiegazione,
        },
      });
      if (!res) {
        return NextResponse.json(
          { error: true, message: "ID non valido" },
          { status: 400 }
        );
      }
      const emailRes = await resend.emails.send({
        from: "noreply@cristiansmarthome.loan",
        to: "delivered@resend.dev",
        subject: "Birdbase - Richiesta di registrazione rifiutata",
        html:
          "<p>Ci dispiace, la tua richiesta di registrazione è stata rifiutata.</p><p>Motivazione: " +
          (datiParsed.spiegazione || "non fornita") +
          ".</p>",
      });
      return NextResponse.json({ error: false, result: res }, { status: 200 });
    }
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
