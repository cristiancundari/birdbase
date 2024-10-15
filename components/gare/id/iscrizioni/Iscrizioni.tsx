"use client";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import { useSupabase } from "@/providers/SupabaseProvider";
import { IscrizioneWithSoggettoAndProfiloWithAllevatore } from "@/types/types";
import {
  Box,
  Button,
  Card,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import { $Enums, Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import IscrizioneItem from "./IscrizioneItem";
import ModalConferma from "@/components/ModalConferma";
import { IconCheck, IconDeviceFloppy } from "@tabler/icons-react";

interface IscrizioniProps {
  iscrizioni: IscrizioneWithSoggettoAndProfiloWithAllevatore[];
  isLoading: boolean;
  garaStatus: $Enums.GaraStatus;
}
function Iscrizioni({ iscrizioni, isLoading, garaStatus }: IscrizioniProps) {
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const [loadingVoti, setLoadingVoti] = useState(false);
  const [copiaIscrizioni, setCopiaIscrizioni] =
    useState<IscrizioneWithSoggettoAndProfiloWithAllevatore[]>(iscrizioni);

  const supabase = useSupabase();

  useEffect(() => {
    setCopiaIscrizioni(iscrizioni);
  }, [iscrizioni]);

  function onVotoChange(idIscrizione: string, voto: number) {
    setCopiaIscrizioni(
      copiaIscrizioni.map((i) => {
        if (i.id === idIscrizione) {
          i.voto = voto;
          return i;
        } else return i;
      })
    );
  }

  async function caricaVoti(setCompletata: boolean) {
    if (copiaIscrizioni.length == 0) return;

    const voti = copiaIscrizioni.map((i) => ({ id: i.id, voto: i.voto }));
    const result = await apiFetch.patch("/admin/api/gare", {
      voti,
      setCompletata,
      garaId: copiaIscrizioni[0].garaId,
    });
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "Il voto è stato assegnato correttamente",
        success: true,
      });
    }

    router.refresh();
  }

  return (
    <>
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
                  {copiaIscrizioni.length == 0 && <NessunaIscrizione />}
                  {copiaIscrizioni.map((iscrizione) => (
                    <IscrizioneItem
                      iscrizione={iscrizione}
                      key={iscrizione.id}
                      onVotoChange={(id, voto) => {
                        onVotoChange(id, voto || 0);
                      }}
                      garaStatus={garaStatus}
                    />
                  ))}
                </>
              )}
            </Stack>
            {supabase.user?.ruolo === Role.ADMIN &&
              garaStatus === "VALUTAZIONE" && (
                <Group justify="end" gap="md" mt="md">
                  <Button
                    color="green"
                    variant="light"
                    loading={loadingVoti}
                    onClick={async () => {
                      setLoadingVoti(true);
                      await caricaVoti(false);
                      setLoadingVoti(false);
                    }}
                  >
                    Salva solo i voti
                  </Button>
                  <Button
                    color="green"
                    loading={loading}
                    onClick={async () => {
                      setloading(true);
                      await caricaVoti(true);
                      setloading(false);
                    }}
                  >
                    Salva e completa la gara
                  </Button>
                </Group>
              )}
          </ScrollArea>
        </Stack>
      </Card>
    </>
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
