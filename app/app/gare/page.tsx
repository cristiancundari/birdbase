import React from "react";
import GarePage from "@/components/gare/garePage";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Gara, Role } from "@prisma/client";
import { GaraWithNazione } from "@/types/types";
import { getServerUserProfile } from "@/lib/supabase/helper";

async function Gare() {
  let gare: GaraWithNazione[] = [];

  const admin = await getServerUserProfile(cookies());
  if (admin?.ruolo == Role.ADMIN) {
    gare = await prisma.gara.findMany({
      include: { nazione: true },
      orderBy: [{ isDeleted: "asc" }, { data: "asc" }],
    });
  } else {
    gare = await prisma.gara.findMany({
      include: { nazione: true },
      where: { isDeleted: false },
      orderBy: [{ isDeleted: "asc" }, { data: "asc" }],
    });
  }
  return <GarePage gare={gare}></GarePage>;
}

export default Gare;
