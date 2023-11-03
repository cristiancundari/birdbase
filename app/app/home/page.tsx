import Homepage from "@/components/home/homePage";
import { prisma } from "@/lib/prisma";
import { Container, Center, Group } from "@mantine/core";
import React from "react";

async function HomePage() {
  const soggetti = await prisma.soggetto.findMany({
    orderBy: {
      dataNascita: "desc",
    },
  });

  return (
    <>
      <Homepage soggetti={soggetti}></Homepage>
    </>
  );
}

export default HomePage;
