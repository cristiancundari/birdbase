import { formatAnelletto } from "@/lib/helper";
import { useSupabase } from "@/providers/SupabaseProvider";
import { IscrizioneWithSoggettoAndProfiloWithAllevatore } from "@/types/types";
import {
  ActionIcon,
  Anchor,
  Grid,
  Group,
  NumberInput,
  Popover,
  rem,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { $Enums, Role } from "@prisma/client";
import { IconShare } from "@tabler/icons-react";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  XIcon,
} from "react-share";
import { getIconSesso } from "../../../IconsSesso";

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
        <Group gap={0}>
          <Group gap="sm">
            {getIconSesso(soggetto.sesso)}
            <Stack gap={0}>
              <Anchor href={`/app/home/${soggetto.id}`} c="dark">
                {formatAnelletto(soggetto.rna, soggetto.numero, soggetto.anno)}
              </Anchor>
              {!isPersonale && (
                <Text c="dimmed" size="xs">
                  {allevatore.nome} {allevatore.cognome}
                </Text>
              )}
            </Stack>
          </Group>
        </Group>
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
                data-testid="input-voto"
              />
            ) : (
              <>
                {isPersonale && iscrizione.posizione && (
                  <Popover position="bottom" withArrow shadow="md">
                    <Popover.Target>
                      <Tooltip label="Condividi">
                        <ActionIcon variant="transparent" color="gray">
                          <IconShare size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Popover.Target>
                    <Popover.Dropdown>
                      <Group gap="xs">
                        <FacebookShareButton
                          url={`${window.location.origin}/results/${iscrizione.garaId}?s=${soggetto.id}`}
                        >
                          <FacebookIcon size={25} round />
                        </FacebookShareButton>
                        <TwitterShareButton
                          url={`${window.location.origin}/results/${iscrizione.garaId}?s=${soggetto.id}`}
                        >
                          <XIcon size={25} round />
                        </TwitterShareButton>
                      </Group>
                    </Popover.Dropdown>
                  </Popover>
                )}
                <Text>{iscrizione.voto || 0}</Text>
              </>
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
              </Group>
            )}
          </Group>
        </Grid.Col>
      )}
    </Grid>
  );
}

export default IscrizioneItem;
