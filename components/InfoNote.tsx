import { ActionIcon, Button, Popover, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconNotes } from "@tabler/icons-react";
import React from "react";

function InfoNote({ note }: { note: string }) {
  const [opened, { close, open }] = useDisclosure(false);
  return (
    <Popover position="top" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <ActionIcon
          onMouseEnter={open}
          onMouseLeave={close}
          variant="transparent"
          color="black"
        >
          <IconNotes size={16} data-testid="IconNote" />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="xs">{note}</Text>
      </Popover.Dropdown>
    </Popover>
  );
}

export default InfoNote;
