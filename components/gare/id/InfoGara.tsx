"use client";
import Breadcrumb from "@/components/Breadcrumb";
import Iscrizioni from "@/components/gare/id/iscrizioni/Iscrizioni";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import { useSupabase } from "@/providers/SupabaseProvider";
import { DiscussionEmbed } from "disqus-react";
import {
  GaraWithIscrizioniWithSoggettoAndProfiloWithAllevatore,
  GaraWithNazioneAndCountIscrizioni,
  IscrizioneWithSoggettoAndProfiloWithAllevatore,
} from "@/types/types";
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { Role } from "@prisma/client";
import { useEffect, useState } from "react";
import Carrello from "./carrello/Carrello";
import Incassi from "./incassi/Incassi";
import InfoGaraHeader from "./InfoGaraHeader";
import { IconAlertCircle } from "@tabler/icons-react";
import Classifica from "./classifica/Classifica";

function InfoGara({ gara }: { gara: GaraWithNazioneAndCountIscrizioni }) {
  const [listaIscrizioni, setListaIscrizioni] = useState<
    IscrizioneWithSoggettoAndProfiloWithAllevatore[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = useSupabase();

  const breadcrumbsItems = [
    {
      title: "Gare",
      href: supabase.user?.ruolo === Role.ADMIN ? "/admin/gare" : "/app/gare",
    },
    { title: "Info gara", href: "#" },
  ];

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
    async function _getIscrizioni() {
      setIsLoading(true);
      await getIscrizioni();
      setIsLoading(false);
    }
    _getIscrizioni();
  }, [gara]);

  const isAdmin = supabase.user?.ruolo === Role.ADMIN;
  return (
    <Container h="100%">
      <Stack gap={0}>
        <Breadcrumb items={breadcrumbsItems} />
        <InfoGaraHeader gara={gara} />
        {gara.stato === "COMPLETATA" ? (
          <Alert
            mt={"sm"}
            variant="light"
            color="blue"
            title="Info Gara"
            icon={<IconAlertCircle />}
          >
            La gara è completata e non è possible iscrivere nuovi soggetti.
          </Alert>
        ) : gara.stato === "VALUTAZIONE" ? (
          <Alert
            mt={"sm"}
            variant="light"
            color="yellow"
            title="Info Gara"
            icon={<IconAlertCircle />}
          >
            La gara è in attesa di valutazione da parte di un amministratore.
            Ritorna più tardi per visualizzare i punteggi e la classifica.
          </Alert>
        ) : gara.capienza - gara._count.iscrizioni <= 0 ? (
          <Alert
            mt={"sm"}
            variant="light"
            color="red"
            title="Info Gara"
            icon={<IconAlertCircle />}
          >
            Non ci sono più posti disponibili per cui non è possibile iscrivere
            alcun soggetto.
          </Alert>
        ) : null}
        <Grid grow mt="sm" overflow="hidden">
          {gara.stato !== "COMPLETATA" && (
            <Grid.Col span={8}>
              <Iscrizioni
                iscrizioni={listaIscrizioni}
                isLoading={isLoading}
                garaStatus={gara.stato}
              />
            </Grid.Col>
          )}
          {gara.stato === "COMPLETATA" ? (
            <Grid.Col span={8}>
              <Classifica iscrizioni={listaIscrizioni} />
            </Grid.Col>
          ) : gara.stato === "VALUTAZIONE" ? null : !isAdmin &&
            gara.capienza - gara._count.iscrizioni > 0 ? (
            <Grid.Col span={4}>
              <Carrello gara={gara} />
            </Grid.Col>
          ) : null}
          {isAdmin && (
            <Grid.Col span={4}>
              <Stack h="100%">
                <Incassi gara={gara} />
              </Stack>
            </Grid.Col>
          )}
        </Grid>

        <Space h="xl" />
        <Divider />
        <Space h="xl" />

        <Box>
          <DiscussionEmbed
            shortname="birdbase"
            config={{
              url: `${window.location.href}`,
              identifier: gara.id,
              title: gara.titolo,
              language: "it",
            }}
          />
        </Box>
      </Stack>
    </Container>
  );
}

export default InfoGara;
