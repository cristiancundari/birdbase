"use client";
import { Center, Container, Group } from "@mantine/core";

import React, { useState } from "react";
import Soggetto from "./soggetto";

function SamplePage() {
  const soggetti = [
    {
      rna: "48XA012",
      data: "03/10/2010",
      gabbia: 18,
      sesso: true,
    },
    {
      rna: "48XA058",
      data: "25/07/2014",
      gabbia: 7,
      sesso: false,
    },
    {
      rna: "48XA123",
      data: "18/02/2016",
      gabbia: 22,
      sesso: false,
    },
    {
      rna: "48XA102",
      data: "09/11/2009",
      gabbia: 9,
      sesso: true,
    },
    {
      rna: "48XA044",
      data: "16/09/2020",
      gabbia: 11,
      sesso: false,
    },
  ];
  return (
    <div>
      <Center>
        <Container size="lg" p="xl">
          <Group>
            {soggetti.map((sog) => (
              <Soggetto
                key={sog.rna}
                rna={sog.rna}
                data={sog.data}
                sesso={sog.sesso}
                gabbia={sog.gabbia}
              />
            ))}
          </Group>
        </Container>
      </Center>
    </div>
  );
}

export default SamplePage;
