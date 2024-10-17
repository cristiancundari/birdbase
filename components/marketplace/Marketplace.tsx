"use client";
import { InserzioneWithSoggettoAndProfilo } from "@/types/types";
import { Box, Button, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import ModalInserzione from "./ModalInserzione";
import { useState } from "react";

function Marketplace({
  inserzioni,
}: {
  inserzioni: InserzioneWithSoggettoAndProfilo[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);
  const btnAggiungiInserzione = () => setIsOpen(true);
  const onConfirm = async ({
    descrizione,
    prezzo,
    soggetto,
  }: {
    descrizione: string;
    prezzo: number;
    soggetto: string;
  }) => {
    console.log(descrizione + " " + prezzo + " " + soggetto);
  };
  return (
    <>
      <Box mb="md">
        <Group justify={"flex-end"}>
          <Button
            data-testid="ButtonAggiungi"
            onClick={btnAggiungiInserzione}
            variant="light"
            leftSection={<IconPlus size={14} />}
          >
            Aggiungi
          </Button>
        </Group>
      </Box>

      <ModalInserzione
        onConfirm={onConfirm}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}

export default Marketplace;
