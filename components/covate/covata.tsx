"use client";
import {
  ActionIcon,
  Anchor,
  Badge,
  Card,
  Collapse,
  Divider,
  Group,
  Menu,
  Stack,
  Text,
  Timeline,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBarrel,
  IconCheck,
  IconChevronDown,
  IconConfetti,
  IconDotsVertical,
  IconEgg,
  IconEggCracked,
  IconEggs,
  IconGenderFemale,
  IconGenderMale,
  IconGitBranch,
  IconGitCommit,
  IconGitPullRequest,
  IconMessageDots,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";

function Covata() {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Card shadow="sm" withBorder>
      <Group gap="xs" justify="space-between">
        <Text>
          <Anchor href="https://mantine.dev/" target="_blank" c="dark">
            12/12/2024
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
              onClick={() => {}}
            >
              Modifica
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size="14" />}
              color="red"
              onClick={() => {}}
            >
              Elimina
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Divider my="sm" />

      <Group justify="space-between">
        <Group gap="xs">
          <IconGenderMale color="#256ceb" size="18" />
          <Text>48XA-128</Text>
        </Group>
        <Group gap="xs">
          <IconBarrel size="14" />
          <Text size="xs" c="dimmed">
            5
          </Text>
        </Group>
      </Group>

      <Group justify="space-between">
        <Group gap="xs">
          <IconGenderFemale color="#f92f8e" size="18" />
          <Text>48XA-129</Text>
        </Group>
        <Group gap="xs">
          <IconEgg size="14" />
          <Text size="xs" c="dimmed">
            0
          </Text>
          /
          <IconEggCracked size="14" />
          <Text size="xs" c="dimmed">
            0
          </Text>
        </Group>
      </Group>
    </Card>
  );
}

export default Covata;
