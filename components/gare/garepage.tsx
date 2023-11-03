"use client";
import React from "react";
import Gara from "./gara";
import { SimpleGrid } from "@mantine/core";
import { Prisma } from "@prisma/client";
import { GaraWithNazione } from "@/types/types";

function garePage({ gare }: { gare: GaraWithNazione[] }) {
  return (
    <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
      {gare.map((gara: GaraWithNazione) => (
        <Gara key={gara.id} gara={gara}></Gara>
      ))}
    </SimpleGrid>
  );
}

export default garePage;
