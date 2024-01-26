"use client";
import { IconTrash } from "@tabler/icons-react";
import React from "react";
import ModalConferma from "./ModalConferma";

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
      messages={[
        "Sei sicuro di procedere con l'eliminazione?",
        "Questa azione non potrà essere annullata.",
      ]}
      confirmButton={{
        icon: <IconTrash size={14} />,
        label: "Elimina",
        color: "red",
      }}
    />
  );
}

export default ModalCancellazione;
