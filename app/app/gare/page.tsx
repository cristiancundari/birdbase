import React from "react";
import GarePage from "@/components/gare/garePage";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Gara } from "@prisma/client";
import { GaraWithNazione } from "@/types/types";

async function Gare() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const session = await supabase.auth.getSession();
  const isAdmin = session.data.session?.user.id;

  let gare: GaraWithNazione[] = [];

  // TODO: aggiustare logica amministratore
  if (true) {
    gare = await prisma.gara.findMany({
      include: { nazione: true },
      orderBy: [{ isDeleted: "asc" }, { dataEvento: "asc" }],
    });
  } else {
    gare = await prisma.gara.findMany({
      include: { nazione: true },
      where: { isDeleted: false },
      orderBy: [{ isDeleted: "asc" }, { dataEvento: "asc" }],
    });
  }
  return <GarePage gare={gare}></GarePage>;
}

export default Gare;
