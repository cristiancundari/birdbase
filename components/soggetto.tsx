"use client";
import { ActionIcon, Box, Group, Paper, Stack, Text } from "@mantine/core";
import {
  IconGenderFemale,
  IconGenderMale,
  IconMail,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import { Soggetto } from "@prisma/client";
import React, { useState } from "react";
import { prisma } from "@/lib/prisma";

type PropsType = {
  dati: Soggetto;
};
function SoggettoComp({ dati }: PropsType) {
  const [dato, setdato] = useState(dati);
  const [isloading, setisloading] = useState(false);
  const preferito = async () => {
    setisloading(true);
    const res = await fetch("/api/soggetto", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dato),
    });
    if (res.status == 200) {
      console.log("OK");
      const setpreferito = await res.json();
      setdato({ ...dato, preferito: setpreferito.result.preferito });
    } else {
      console.log("errore");
    }
    setisloading(false);
  };

  return (
    <Paper shadow="sm" p="lg" withBorder>
      <Group justify="space-between" gap="xs">
        <Group gap="xs">
          {dati.sesso ? (
            <IconGenderMale />
          ) : (
            dati.sesso == false && <IconGenderFemale />
          )}
          <Text>{dati.anelletto}</Text>
          <Text>{dati.gabbia}</Text>
          <Text>{dati.dataNascita.toDateString()}</Text>
        </Group>
        <Group>
          <ActionIcon
            loading={isloading}
            color="dark"
            variant="transparent"
            size="lg"
            onClick={() => {
              preferito();
            }}
          >
            {dato.preferito ? (
              <IconStarFilled size="1.625rem" style={{ color: "#f9ce36" }} />
            ) : (
              <IconStar size="1.625rem" />
            )}
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  );
}

export default SoggettoComp;
