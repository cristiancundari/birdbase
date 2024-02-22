"use client";
import {
  Box,
  Card,
  Container,
  Grid,
  Group,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import IscrizioneItem from "./iscrizioni/IscrizioneItem";
import Carrello from "./carrello/Carrello";
import InfoGaraHeader from "./InfoGaraHeader";
import {
  ApiResponse,
  GaraWithIscrizioniWithSoggettoAndProfiloWithAllevatore,
  GaraWithNazioneAndCountIscrizioni,
  IscrizioneWithSoggettoAndProfiloWithAllevatore,
} from "@/types/types";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import Breadcrumb from "@/components/Breadcrumb";
import Iscrizioni from "@/components/gare/id/iscrizioni/Iscrizioni";

const breadcrumbsItems = [
  { title: "Gare", href: "/app/gare" },
  { title: "Info gara", href: "#" },
];

function InfoGara({ gara }: { gara: GaraWithNazioneAndCountIscrizioni }) {
  const [listaIscrizioni, setListaIscrizioni] = useState<
    IscrizioneWithSoggettoAndProfiloWithAllevatore[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getIscrizioni() {
    const res =
      await apiFetch.get<GaraWithIscrizioniWithSoggettoAndProfiloWithAllevatore>(
        `/api/gare/${gara.id}`
      );
    if (res.error) {
      showNotification({ message: res.message });
    } else {
      const iscrizioni = res.data.iscrizioni;
      setListaIscrizioni(iscrizioni);
    }
  }

  useEffect(() => {
    async function _getIscrizioni() {
      setIsLoading(true);
      await getIscrizioni();
      setIsLoading(false);
    }
    _getIscrizioni();
  }, [gara]);

  return (
    <Container h="100%">
      <Stack gap={0}>
        <Breadcrumb items={breadcrumbsItems} />
        <InfoGaraHeader gara={gara} />
        <Grid grow mt="sm">
          <Grid.Col span={4}>
            <Iscrizioni iscrizioni={listaIscrizioni} isLoading={isLoading} />
          </Grid.Col>
          <Grid.Col span={1}>
            <Carrello gara={gara} />
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

export default InfoGara;
