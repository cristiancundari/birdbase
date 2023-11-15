"use client";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconTrash, IconX } from "@tabler/icons-react";
import React, { useState } from "react";

function ModalCancellazione({
  titolo,
  onDelete,
  onClose,
  isOpen,
}: {
  titolo: string;
  onDelete: () => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal opened={isOpen} onClose={onClose} title={titolo}>
      <Stack gap="xs" align="center">
        <Text size="sm">{"Sei sicuro di procedere con l'eliminazione?"}</Text>
        <Text size="sm">Questa azione non potrà essere annullata.</Text>
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
          color="red"
          leftSection={<IconTrash size={14} />}
          loading={isLoading}
          onClick={async () => {
            setIsLoading(true);
            await onDelete();
            setIsLoading(false);
          }}
        >
          Elimina
        </Button>
      </Group>
    </Modal>
  );
}

export default ModalCancellazione;
