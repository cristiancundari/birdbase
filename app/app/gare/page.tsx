import React from "react";
import GarePage from "@/components/gare/garepage";
import { prisma } from "@/lib/prisma";

async function Gare() {
  const gare = await prisma.gara.findMany({ include: { nazione: true } });

  return <GarePage gare={gare}></GarePage>;
}

export default Gare;
