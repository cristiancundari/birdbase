import {
  Anchor,
  Flex,
  Grid,
  Group,
  NumberInput,
  rem,
  Text,
} from "@mantine/core";
import {
  IconSessoAgender,
  IconSessoFemale,
  IconSessoMale,
} from "../../../IconsSesso";
import {
  IscrizioneWithSoggettoAndProfiloWithAllevatore,
  Sesso,
} from "@/types/types";
import { formatAnelletto } from "@/lib/helper";
import { useSupabase } from "@/providers/SupabaseProvider";
import { $Enums, Prisma, Role } from "@prisma/client";
import { useState } from "react";

function IscrizioneItem({
  iscrizione,
  onVotoChange,
  garaStatus,
  isPersonale,
}: {
  iscrizione: IscrizioneWithSoggettoAndProfiloWithAllevatore;
  onVotoChange?: (idIscrizione: string, voto: number) => void;
  garaStatus?: $Enums.GaraStatus;
  isPersonale?: boolean;
}) {
  const soggetto = iscrizione.soggetto;
  const allevatore = iscrizione.profilo.allevatore;
  const supabase = useSupabase();

  const isAdmin = supabase.user?.ruolo === Role.ADMIN;
  const posizioni = ["🥇", "🥈", "🥉"];
  return (
    <Grid grow align="center">
      <Grid.Col span={8}>
        <Flex gap="md" justify="space-between">
          <Group gap="sm">
            {soggetto.sesso === true ? (
              <IconSessoMale />
            ) : soggetto.sesso == false ? (
              <IconSessoFemale />
            ) : (
              <IconSessoAgender />
            )}
            <Anchor href="#" c="dark">
              {formatAnelletto(soggetto.rna, soggetto.numero, soggetto.anno)}
            </Anchor>
          </Group>

          {!isPersonale && (
            <Group>
              <Text c="dimmed">
                {allevatore.nome} {allevatore.cognome}
              </Text>
            </Group>
          )}
        </Flex>
      </Grid.Col>

      {((isAdmin && garaStatus === "VALUTAZIONE") ||
        garaStatus === "COMPLETATA") && (
        <Grid.Col span={4}>
          <Group w="100%" justify="end">
            {isAdmin && garaStatus === "VALUTAZIONE" ? (
              <NumberInput
                max={100}
                min={1}
                w={70}
                hideControls
                clampBehavior="strict"
                value={iscrizione.voto || 0}
                onChange={(val) => {
                  onVotoChange && onVotoChange(iscrizione.id, Number(val));
                }}
              />
            ) : (
              <Text>{iscrizione.voto || 0}</Text>
            )}

            {iscrizione.posizione == null ? (
              <Text fs="italic" size="sm" c="dimmed">
                N.C.
              </Text>
            ) : (
              <Group gap="xs">
                <Text size={rem(25)}>
                  {posizioni[iscrizione.posizione - 1] || ""}
                </Text>
                {/* <Text fw={500}>{iscrizione.posizione}</Text> */}
              </Group>
            )}
          </Group>
        </Grid.Col>
      )}
    </Grid>
  );
}

export default IscrizioneItem;
