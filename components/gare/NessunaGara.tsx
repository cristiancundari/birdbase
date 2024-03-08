"use client";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Box, Text } from "@mantine/core";
import { Role } from "@prisma/client";
import React from "react";

function NessunaGara() {
  const supabase = useSupabase();
  return (
    <Box>
      <Text>Nessuna gara trovata.</Text>
      {supabase.user?.ruolo === Role.ADMIN && (
        <Text>
          Inizia creando un nuova gara utilizzando il pulsante Aggiungi in alto
        </Text>
      )}
    </Box>
  );
}

export default NessunaGara;
