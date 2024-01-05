"use client";
import { useSupabase } from "@/providers/supabaseProvider";
import { Box, Text } from "@mantine/core";
import React from "react";

function NessunaGara() {
  const supabase = useSupabase();
  return (
    <Box>
      <Text>Nessuna gara trovata.</Text>
      {supabase.isAdmin && (
        <Text>
          Inizia creando un nuova gara utilizzando il pulsante Aggiungi in alto
        </Text>
      )}
    </Box>
  );
}

export default NessunaGara;
