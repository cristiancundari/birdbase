"use client";
import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Card,
  Center,
  Container,
  Divider,
  Group,
  Menu,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconBarrel,
  IconDotsVertical,
  IconGenderFemale,
  IconGenderMale,
  IconHeart,
  IconHeartFilled,
  IconPencil,
  IconStar,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react";
import React, { useState } from "react";

function Soggetto({ rna, gabbia, sesso, data }: any) {
  const [isFavourite, setIsFavourite] = useState(false);
  const [isFavouriteLoading, setIsFavouriteLoading] = useState(false);
  const handleFavourite = async () => {
    setIsFavouriteLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsFavouriteLoading(false);
    setIsFavourite(!isFavourite);
  };
  return (
    <Card shadow="sm" withBorder>
      <Group gap="xs" justify="space-between">
        {sesso ? (
          <IconGenderMale color="#256ceb" />
        ) : (
          <IconGenderFemale color="#f92f8e" />
        )}
        <Text>
          <Anchor href="https://mantine.dev/" target="_blank" c="dark">
            {rna}
          </Anchor>
        </Text>
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDotsVertical size="14" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconPencil size="14" />}>
              Modifica
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size="14" />} color="red">
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
            src="https://www.cocoriti.com/files/cocoblog/20130617_182440.jpg"
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
              <Text size="xs">{data}</Text>
            </Group>
            <Text size="xs" c="dimmed">
              15 anni &#x2022; 5 mesi
            </Text>
          </Stack>
          <Tooltip label="Gabbia #14">
            <Group gap="3">
              <IconBarrel size="16" />
              <Text size="sm">{gabbia}</Text>
            </Group>
          </Tooltip>
        </Stack>
      </Group>
    </Card>
  );
}

export default Soggetto;
