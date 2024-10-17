"use client";
import { IconTrash } from "@tabler/icons-react";
import React from "react";
import ModalConferma from "./ModalConferma";
import { Stack, Text } from "@mantine/core";

function ModalCancellazione({
  titolo,
  onDelete,
  onClose,
  isOpen,
  ...others
}: {
  titolo: string;
  onDelete: () => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
}) {
  return (
    <ModalConferma
      {...others}
      isOpen={isOpen}
      onConfirm={onDelete}
      onClose={onClose}
      titolo={titolo}
      confirmButton={{
        icon: <IconTrash size={14} />,
        label: "Elimina",
        color: "red",
      }}
    >
      <Stack gap="xs" align="center">
        <Text size="sm">{"Sei sicuro di procedere con l'eliminazione?"}</Text>
        <Text size="sm">{"Questa azione non potrà essere annullata."}</Text>
      </Stack>
    </ModalConferma>
  );
}

export default ModalCancellazione;
