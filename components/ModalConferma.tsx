"use client";
import { Box, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import React, { PropsWithChildren, useState } from "react";

interface ModalConferma {
  titolo: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
  closeOnSubmit?: boolean;
  confirmButton: {
    label: string;
    icon: React.ReactNode;
    color?: string;
  };
}

function ModalConferma({
  titolo,
  onConfirm,
  onClose,
  isOpen,
  confirmButton,
  closeOnSubmit = true,
  children,
  ...others
}: PropsWithChildren<ModalConferma>) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal opened={isOpen} onClose={onClose} title={titolo} {...others}>
      <Box>{children}</Box>

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
            closeOnSubmit && onClose();
          }}
        >
          {confirmButton.label}
        </Button>
      </Group>
    </Modal>
  );
}

export default ModalConferma;
