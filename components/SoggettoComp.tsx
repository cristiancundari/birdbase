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
  Tooltip,
} from "@mantine/core";
import { Soggetto } from "@prisma/client";
import {
  IconBarrel,
  IconDotsVertical,
  IconGrave,
  IconHeart,
  IconHeartFilled,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { format, formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { useState } from "react";
import { IconSessoAgender, IconSessoFemale, IconSessoMale } from "./IconsSesso";
import { formatAnelletto, imgPath } from "@/lib/helper";
import InfoGabbia from "./InfoGabbia";
import InfoMorto from "./InfoMorto";
import InfoNote from "./InfoNote";

export interface SoggettoMenu {
  label: string;
  icon: React.ReactNode;
  fn: (soggetto: Soggetto) => void;
  color?: string;
}

interface SoggettoCompProps {
  sogg: Soggetto;
  onPreferito: (id: string) => Promise<Soggetto | null>;
  menu: SoggettoMenu[];
}

function SoggettoComp({ sogg, onPreferito, menu }: SoggettoCompProps) {
  const [isFavourite, setIsFavourite] = useState(sogg.preferito);
  const [isFavouriteLoading, setIsFavouriteLoading] = useState(false);

  const handleFavourite = async () => {
    setIsFavouriteLoading(true);
    const result = await onPreferito(sogg.id);
    if (result) {
      setIsFavourite(result.preferito);
    }
    setIsFavouriteLoading(false);
  };

  return (
    <Card shadow="sm" withBorder data-testid="SoggettoComp">
      <Group gap="xs" justify="space-between">
        {sogg.sesso && <IconSessoMale size="25" />}
        {sogg.sesso == false && <IconSessoFemale size="25" />}
        {sogg.sesso == null && <IconSessoAgender size="25" />}
        <Text>
          <Anchor href={`/app/home/${sogg.id}`} c="dark">
            {formatAnelletto(sogg.rna, sogg.numero, sogg.anno)}
          </Anchor>
        </Text>
        {menu.length > 0 ? (
          <Menu shadow="md">
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                data-testid="MenuButton"
              >
                <IconDotsVertical size="14" />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {menu.map((item) => (
                <Menu.Item
                  key={item.label}
                  leftSection={item.icon}
                  color={item.color}
                  onClick={() => {
                    item.fn(sogg);
                  }}
                >
                  {item.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Box></Box>
        )}
      </Group>
      <Divider my="sm" />
      <Group>
        <Box pos="relative">
          <Avatar
            data-testid="ImgAvatar"
            variant="filled"
            size="xl"
            src={
              sogg.avatar
                ? imgPath + sogg.avatar
                : `https://images.placeholders.dev/?width=50&height=50&textWrap=true&text=${formatAnelletto(
                    sogg.rna,
                    sogg.numero,
                    sogg.anno
                  )}`
            }
          />
          <Tooltip label="Preferito">
            <ActionIcon
              data-testid="ButtonPreferito"
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
                <IconHeartFilled
                  size="20"
                  style={{ color: "#e83d2e" }}
                  data-testid="IconPreferito"
                />
              ) : (
                <IconHeart
                  size="20"
                  color="#555"
                  data-testid="IconNonPreferito"
                />
              )}
            </ActionIcon>
          </Tooltip>
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
          <Group gap="xs">
            {sogg.note && <InfoNote note={sogg.note} />}
            {sogg.gabbia && !sogg.isMorto && (
              <InfoGabbia gabbia={sogg.gabbia} hideNull />
            )}
            {sogg.isMorto && <InfoMorto />}
          </Group>
        </Stack>
      </Group>
    </Card>
  );
}

export default SoggettoComp;
