import {
  formatAnelletto,
  formatValuta,
  getBucketImgPath,
  showNotification,
} from "@/lib/helper";
import { InserzioneWithSoggettoAndAllevatoreAndRisultatiGare } from "@/types/types";
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Menu,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEye,
  IconPencil,
  IconShoppingCart,
  IconTrash,
} from "@tabler/icons-react";
import { getIconSesso } from "../IconsSesso";
import { useMemo } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import PayPalButton from "@/components/PayPalButton";
import { apiFetch } from "@/lib/apiFetch";
import { OrdineInserzione } from "@prisma/client";

function InserzioneItem({
  inserzione,
  onEdit,
  onDelete,
}: {
  inserzione: InserzioneWithSoggettoAndAllevatoreAndRisultatiGare;
  onEdit: (
    inserzione: InserzioneWithSoggettoAndAllevatoreAndRisultatiGare
  ) => void;
  onDelete: (id: number) => void;
}) {
  const captureOrder = async (ordineId: string) => {
    const result = await apiFetch.post<OrdineInserzione>(
      "/api/paypal/inserzioni/captureorder",
      {
        id: ordineId,
      }
    );
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "Soggetto acquistato correttamente",
        success: true,
      });
    }
  };

  const createOrder = async () => {
    const result = await apiFetch.post<OrdineInserzione>(
      "/api/paypal/inserzioni/createorder",
      {
        descrizione:
          "Acquisto soggetto " +
          formatAnelletto(
            inserzione.soggetto.rna,
            inserzione.soggetto.numero,
            inserzione.soggetto.anno
          ),
        prezzo: inserzione.prezzo,
        profiloId: supabase.user?.id,
        inserzioneId: inserzione.id,
      }
    );

    if (result.error) {
      showNotification({ message: result.message, success: false });
    } else {
      return result.data.id;
    }
    return "";
  };

  const risultatiGare = useMemo(
    () =>
      inserzione.soggetto.iscrizioni.reduce(
        (risultati, iscrizione) => {
          if (iscrizione.posizione === 1) {
            risultati.primo += 1;
          } else if (iscrizione.posizione === 2) {
            risultati.secondo += 1;
          } else if (iscrizione.posizione === 3) {
            risultati.terzo;
          }
          return risultati;
        },
        { primo: 0, secondo: 0, terzo: 0 }
      ),
    [inserzione]
  );

  const supabase = useSupabase();
  const countGare = inserzione.soggetto.iscrizioni.length;
  const isMine = supabase.user?.id == inserzione.profiloId;

  return (
    <Grid justify="start" grow>
      <Grid.Col span={2}>
        <Flex justify="center" align="center" h="100%">
          <Image
            src={
              inserzione.soggetto.avatar
                ? getBucketImgPath("img", inserzione.soggetto.avatar)
                : `https://images.placeholders.dev/?width=200&height=200&textWrap=true&text=${formatAnelletto(
                    inserzione.soggetto.rna,
                    inserzione.soggetto.numero,
                    inserzione.soggetto.anno
                  )}`
            }
          ></Image>
        </Flex>
      </Grid.Col>
      <Grid.Col span={8}>
        <Stack h="100%" justify="space-between">
          <Stack gap={0}>
            <Group gap="xs">
              {getIconSesso(inserzione.soggetto.sesso, 30)}
              <Anchor
                href={`/app/home/${inserzione.soggetto.id}`}
                c="dark"
                fz="xl"
                fw={500}
              >
                {formatAnelletto(
                  inserzione.soggetto.rna,
                  inserzione.soggetto.numero,
                  inserzione.soggetto.anno
                )}
              </Anchor>
            </Group>
            <Text c="dimmed">
              {inserzione.profilo.allevatore.rna}
              {" - "}
              {inserzione.profilo.allevatore.nome}{" "}
              {inserzione.profilo.allevatore.cognome}
            </Text>
            <Text mt="xs">{inserzione.descrizione}</Text>
          </Stack>
          <Stack gap={0} mt="sm">
            <Divider />
            <Text fs="italic" c="dimmed">
              Ha partecipato a {countGare} {countGare == 1 ? "gara" : "gare"}
            </Text>
            {countGare > 0 && (
              <Group>
                <Group gap="xs">
                  <Text>🥇</Text>
                  <Text>{risultatiGare.primo}</Text>
                </Group>
                <Group gap="xs">
                  <Text>🥈</Text>
                  <Text>{risultatiGare.secondo}</Text>
                </Group>
                <Group gap="xs">
                  <Text>🥉</Text>
                  <Text>{risultatiGare.terzo}</Text>
                </Group>
              </Group>
            )}
          </Stack>
        </Stack>
      </Grid.Col>
      <Grid.Col span={2}>
        {isMine && (
          <Menu shadow="md">
            <Menu.Target>
              <ActionIcon
                variant="white"
                radius="xl"
                color="gray"
                pos="absolute"
                top="10px"
                right="10px"
                data-testid="vertical-dots-test"
              >
                <IconDotsVertical size="14" />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconPencil size="14" />}
                onClick={() => {
                  onEdit(inserzione);
                }}
              >
                Modifica
              </Menu.Item>
              <Menu.Item
                leftSection={<IconTrash size="14" />}
                color="red"
                onClick={() => {
                  onDelete(inserzione.id);
                }}
              >
                Elimina
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}

        <Flex
          justify={{ base: "end", lg: "center" }}
          align="center"
          h="100%"
          direction={{ base: "row", lg: "column" }}
          gap="md"
          mt="sm"
        >
          <Title order={2} c="indigo">
            {formatValuta(inserzione.prezzo)}
          </Title>

          {!isMine && (
            <PayPalButton
              captureOrder={captureOrder}
              createOrder={createOrder}
              style={{ color: "blue" }}
            />
          )}
        </Flex>
      </Grid.Col>
    </Grid>
  );
}

export default InserzioneItem;
