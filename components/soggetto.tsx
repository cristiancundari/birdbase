"use client";
import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Card,
  Divider,
  Group,
  Menu,
  Stack,
  Text,
  Tooltip
} from "@mantine/core";
import { Soggetto } from "@prisma/client";
import {
  IconBarrel,
  IconDotsVertical,
  IconGenderAgender,
  IconGenderFemale,
  IconGenderMale,
  IconGrave,
  IconHeart,
  IconHeartFilled,
  IconPencil,
  IconTrash
} from "@tabler/icons-react";
import { format, formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { useState } from "react";

function SoggettoComp({
  sogg,
  onEdit,
  onDelete,
  handlerPreferito,
}: {
  sogg: Soggetto;
  onEdit: (soggetto: Soggetto) => void;
  onDelete: (id: string) => void;
  handlerPreferito: (id: string) => Promise<Soggetto | null>;
}) {
  const [isFavourite, setIsFavourite] = useState(sogg.preferito);
  const [isFavouriteLoading, setIsFavouriteLoading] = useState(false);

  const handleFavourite = async () => {
    setIsFavouriteLoading(true);
    const result = await handlerPreferito(sogg.id);
    if (result) {
      setIsFavourite(result.preferito);
    }
    setIsFavouriteLoading(false);
  };

  return (
    <Card shadow="sm" withBorder>
      <Group gap="xs" justify="space-between">
        {sogg.sesso && <IconGenderMale color="#256ceb" size="25" />}
        {sogg.sesso == false && <IconGenderFemale color="#f92f8e" size="25" />}
        {sogg.sesso == null && <IconGenderAgender color="#d6d6d6" size="25" />}
        <Text>
          <Anchor href="https://mantine.dev/" target="_blank" c="dark">
            {sogg.rna}-{sogg.numero}
          </Anchor>
        </Text>
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDotsVertical size="14" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconPencil size="14" />}
              onClick={() => {
                onEdit(sogg);
              }}
            >
              Modifica
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size="14" />}
              color="red"
              onClick={() => {
                onDelete(sogg.id);
              }}
            >
              Elimina
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Divider my="sm" />
      <Group>
        <Box pos="relative">
          <Avatar
            variant="filled"
            size="xl"
            src={
              sogg.avatar
                ? `https://yhpgtvnrcgqnqdkdbnqo.supabase.co/storage/v1/object/public/img/${sogg.avatar}`
                : `https://images.placeholders.dev/?width=50&height=50&text=${
                    sogg.rna + "-" + sogg.numero
                  }`
            }
          />
          <ActionIcon
            color="dark"
            onClick={handleFavourite}
            loading={isFavouriteLoading}
            variant="white"
            radius="xl"
            pos="absolute"
            bottom="0"
            left="0"
            style={{ boxShadow: "0px 0px 4px 1px rgba(0,0,0,0.3)" }}
          >
            {isFavourite ? (
              <IconHeartFilled size="20" style={{ color: "#e83d2e" }} />
            ) : (
              <IconHeart size="20" color="#555" />
            )}
          </ActionIcon>
        </Box>

        <Stack gap="0" justify="space-evenly" style={{ alignSelf: "stretch" }}>
          <Stack gap="0">
            <Group gap="xs">
              <Text size="xs" c="dimmed">
                Data:
              </Text>
              <Text size="xs">{format(sogg.dataNascita, "dd/MM/yyyy")}</Text>
            </Group>
            <Text size="xs" c="dimmed">
              {formatDistanceToNow(sogg.dataNascita, { locale: it })}
            </Text>
          </Stack>
          {sogg.gabbia && !sogg.is_morto && (
            <Group>
              <Tooltip label={`Gabbia #${sogg.gabbia}`} position="bottom">
                <Group gap="3">
                  <IconBarrel size="16" />
                  <Text size="sm">{sogg.gabbia}</Text>
                </Group>
              </Tooltip>
            </Group>
          )}
          {sogg.is_morto && (
            <IconGrave size="16"/>
          )}
        </Stack>
      </Group>
    </Card>
  );
}

export default SoggettoComp;
