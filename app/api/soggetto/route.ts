import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { Sesso } from "@/types/types";
import {z} from "zod"

export async function DELETE(request: Request) {
    const dati = await request.json();

    const datiSchema = z.object({
        id: z.string().min(1),
    });
    const test = datiSchema.safeParse(dati);
    if (!test.success) {
        return NextResponse.json({ error: true, result: test.error.message }, { status: 400 });
    }

    let result = await prisma.soggetto.delete({ where: { id: dati.id } });
    
    return NextResponse.json({ error: false, result: result }, { status: 200 });
}


export async function PATCH(request: Request) {
    const dati = await request.json();

    const datiSchema = z.object({
        id: z.string().min(1),
        preferito: z.boolean().optional(),
        dataNascita: z.string().transform((v) => new Date(v)),
        sesso: z.boolean().nullable(),
        gabbia: z.number().nullable().or(z.string().nullable().transform((v)=>parseInt(v || ""))),
        rna: z.string(),
        numero: z.string(),
        avatar:  z.string().nullish(),
    })

    const test = datiSchema.safeParse(dati);

    if (!test.success) {
        return NextResponse.json({ error: true, result: test.error.message }, { status: 400 });
    }
    
    const result = await prisma.soggetto.update({
        where: {
            id: dati.id,
        },
        data: {
            preferito: dati.preferito,
            dataNascita: test.data.dataNascita,
            sesso: dati.sesso,
            gabbia: test.data.gabbia,
            rna: dati.rna,
            numero: dati.numero,
            avatar: dati.avatar,
        },
    })
    
    return NextResponse.json({ error: false, result:result }, { status: 200 });
}

interface PostDataType { rna: string; numero: string; dataNascita: Date; sesso: string; gabbia: number | string; avatar: string | undefined }
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    const dati: PostDataType = await request.json();

    const datiSchema = z.object({
        preferito: z.boolean().optional(),
        dataNascita: z.string().datetime(),
        sesso: z.nativeEnum(Sesso),
        gabbia: z.number().nullable().or(z.string().nullable().transform((v)=>parseInt(v || ""))),
        rna: z.string(),
        numero: z.string(),
        avatar: z.string().nullable()
    })

    const test = datiSchema.safeParse(dati);

    if (!test.success) {
        return NextResponse.json({ error: true, result: test.error.message }, { status: 400 });
    }
    
    const controllo = await prisma.soggetto.findFirst({
        where:{numero: dati.numero, rna: dati.rna}
    })
    if (controllo) {
        return NextResponse.json({ error: true, result:"Il soggetto è già presente" }, { status: 400 });
    }
   
    const newSoggetto = await prisma.soggetto.create({
        data: {
            rna: dati.rna,
            numero: dati.numero,
            sesso: dati.sesso == Sesso.Maschio ? true : dati.sesso == Sesso.Femmina ? false : null,
            gabbia: test.data.gabbia,
            dataNascita: new Date(test.data.dataNascita),
            profileId: session?.user.id || "",
            avatar: dati.avatar
        }
    })

    return NextResponse.json({ error: false, result:newSoggetto }, { status: 200 });
}