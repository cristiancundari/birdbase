import { useSupabase } from "@/providers/SupabaseProvider";
import { IscrizioneWithSoggettoAndProfiloWithAllevatore } from "@/types/types";
import { Card, Grid, GridCol, Stack, Text } from "@mantine/core";
import { $Enums, Role } from "@prisma/client";
import { useMemo } from "react";
import IscrizioneItem from "../iscrizioni/IscrizioneItem";

function Classifica({
  iscrizioni,
}: {
  iscrizioni: IscrizioneWithSoggettoAndProfiloWithAllevatore[];
}) {
  const supabase = useSupabase();
  const iscrittiTotali = useMemo(
    () =>
      [...iscrizioni].sort(
        (iscrizione1, iscrizione2) =>
          (iscrizione2.voto || 0) - (iscrizione1.voto || 0)
      ),
    [iscrizioni]
  );
  const iscrittiPersonali = useMemo(
    () =>
      [...iscrittiTotali].filter(
        (iscrizione) => iscrizione.profiloId === supabase.user?.id
      ),
    [iscrittiTotali]
  );

  return (
    <Grid grow>
      <Grid.Col span={8}>
        <Card shadow="xs">
          <Text fw={500} fz="lg">
            Classifica
          </Text>
          <Stack gap="md" mt="lg">
            {iscrittiTotali.map((iscrizione) => {
              return (
                <IscrizioneItem
                  iscrizione={iscrizione}
                  key={iscrizione.id}
                  garaStatus="COMPLETATA"
                />
              );
            })}
          </Stack>
        </Card>
      </Grid.Col>
      {supabase.user?.ruolo !== Role.ADMIN && iscrittiPersonali.length > 0 && (
        <Grid.Col span={4}>
          <Card shadow="xs">
            <Text fw={500} fz="lg">
              Classifica Personale
            </Text>
            <Stack gap="md" mt="lg">
              {iscrittiPersonali.map((iscrizione) => {
                return (
                  <IscrizioneItem
                    iscrizione={iscrizione}
                    key={iscrizione.id}
                    garaStatus="COMPLETATA"
                    isPersonale={true}
                  />
                );
              })}
            </Stack>
          </Card>
        </Grid.Col>
      )}
    </Grid>
  );
}

export default Classifica;
