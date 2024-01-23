"use client";
import { Box, Text } from "@mantine/core";

const NessunSoggetto = () => {
  return (
    <Box data-testid="NessunSoggetto">
      <Text>Nessun soggetto trovato.</Text>
      <Text>
        Inizia creando un nuovo soggetto utilizzando il pulsante Aggiungi in
        alto
      </Text>
    </Box>
  );
};

export default NessunSoggetto;
