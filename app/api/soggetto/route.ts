import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function PATCH(request: Request) {
    let result = null;
    const dati = await request.json();
    
    result = await prisma.soggetto.update({
        where: {
            id: dati.id,
        },
        data: {
            preferito: !dati.preferito,
        },
    })
    
    return NextResponse.json({ error: false, result:result }, { status: 200 });
}

type PostDataType = { rna: string; numeroanelletto: string; datadinascita: Date; sesso: string }
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    const dati: PostDataType = await request.json();
    const controllo = await prisma.soggetto.findFirst({
        where:{anelletto: dati.rna+dati.numeroanelletto}
    })
    if (controllo) {
        return NextResponse.json({ error: true, result:"Il soggetto è già presente" }, { status: 400 });
    }
    const newSoggetto = await prisma.soggetto.create({
        data: {
            anelletto: dati.rna + dati.numeroanelletto,
            sesso: dati.sesso == "Maschio" ? true : dati.sesso == "Femmina" ? false : null,
            dataNascita: dati.datadinascita,
            profileId: session?.user.id || ""
        }
    })

    return NextResponse.json({ error: false, result:newSoggetto }, { status: 200 });
}