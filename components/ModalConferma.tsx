"use client";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import React, { useState } from "react";

interface ModalConferma {
  titolo: string;
  messages?: string[];
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
  confirmButton: {
    label: string;
    icon: React.ReactNode;
    color?: string;
  };
}

function ModalConferma({
  titolo,
  messages,
  onConfirm,
  onClose,
  isOpen,
  confirmButton,
}: ModalConferma) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal opened={isOpen} onClose={onClose} title={titolo}>
      <Stack gap="xs" align="center">
        {messages?.map((m, index) => (
          <Text size="sm" key={index}>{m}</Text>
        ))}
      </Stack>

      <Group mt={"lg"} gap="md" justify="flex-end">
        <Button
          variant="outline"
          color="gray"
          onClick={onClose}
          leftSection={<IconX size={14} />}
        >
          Annulla
        </Button>
        <Button
          color={confirmButton.color}
          leftSection={confirmButton.icon}
          loading={isLoading}
          onClick={async () => {
            setIsLoading(true);
            await onConfirm();
            setIsLoading(false);
            onClose();
          }}
        >
          {confirmButton.label}
        </Button>
      </Group>
    </Modal>
  );
}

export default ModalConferma;
