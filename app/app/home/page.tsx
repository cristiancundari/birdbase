import Homepage from "@/components/homepage";
import { prisma } from "@/lib/prisma";
import React from "react";

async function HomePage() {
  const soggetti = await prisma.soggetto.findMany();

  return <Homepage soggetti={soggetti}></Homepage>;
}

export default HomePage;
