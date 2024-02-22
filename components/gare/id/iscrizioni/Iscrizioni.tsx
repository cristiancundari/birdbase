import {
  Card,
  ScrollArea,
  Box,
  Text,
  Skeleton,
  Stack,
  Paper,
} from "@mantine/core";
import React from "react";
import IscrizioneItem from "./IscrizioneItem";
import { IscrizioneWithSoggettoAndProfiloWithAllevatore } from "@/types/types";

interface IscrizioniProps {
  iscrizioni: IscrizioneWithSoggettoAndProfiloWithAllevatore[];
  isLoading: boolean;
}
function Iscrizioni({ iscrizioni, isLoading }: IscrizioniProps) {
  return (
    <Card p={0} shadow="xs">
      <Stack gap={0}>
        <Text fw={500} fz="lg" p="md">
          Lista soggetti iscritti
        </Text>
        <ScrollArea h="500" mt="md" px="md">
          <Stack>
            {isLoading ? (
              Array(6)
                .fill(0)
                .map((_, index) => (
                  <Skeleton key={index} height={30} width="100%" />
                ))
            ) : (
              <>
                {iscrizioni.length == 0 && <NessunaIscrizione />}
                {iscrizioni.map((iscrizione) => (
                  <IscrizioneItem iscrizione={iscrizione} key={iscrizione.id} />
                ))}
              </>
            )}
          </Stack>
        </ScrollArea>
      </Stack>
    </Card>
  );
}

function NessunaIscrizione() {
  return (
    <Box c="dimmed">
      <Text>Ancora nessun soggetto iscritto</Text>
    </Box>
  );
}

export default Iscrizioni;
