"use client";
import {
  Box,
  Card,
  Container,
  Grid,
  Group,
  ScrollArea,
  Text,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import IscrizioneComp from "./GaraComp";
import Carrello from "./Carrello";
import InfoGaraHeader from "./InfoGaraHeader";
import {
  ApiResponse,
  GaraWithIscrizioniWithSoggettoAndProfiloWithAllevatore,
  GaraWithNazioneAndCountIscrizioni,
  IscrizioneWithSoggettoAndProfiloWithAllevatore,
} from "@/types/types";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";

function InfoGara({ gara }: { gara: GaraWithNazioneAndCountIscrizioni }) {
  const [listaIscrizioni, setListaIscrizioni] = useState<
    IscrizioneWithSoggettoAndProfiloWithAllevatore[]
  >([]);

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
    getIscrizioni();
  }, []);

  return (
    <Container h="100vh">
      <InfoGaraHeader gara={gara} />
      <Grid grow mt={"sm"}>
        <Grid.Col span={4}>
          <ScrollArea h="500" w="100%">
            <Card>
              <Text size="xl" fw="500" p="md">
                Lista soggetti iscritti
              </Text>
              {listaIscrizioni.map((iscrizione) => (
                <Box p="sm" key={iscrizione.id}>
                  <IscrizioneComp iscrizione={iscrizione} />
                </Box>
              ))}
            </Card>
          </ScrollArea>
        </Grid.Col>
        <Grid.Col span={1}>
          <Card p={0} pos="relative">
            <Carrello gara={gara} />
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default InfoGara;
