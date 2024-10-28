import { Button, Modal, NumberInput, Text, TextInput } from "@mantine/core";
import ComboboxSoggetto from "../covate/comboboxSoggetto";
import { useEffect, useState } from "react";
import ModalConferma from "../ModalConferma";
import { IconCheck } from "@tabler/icons-react";
import { useModalInit } from "@/lib/hooks";
import { apiFetch } from "@/lib/apiFetch";
import { Inserzione, Soggetto } from "@prisma/client";
import { SoggettoWithParentela } from "@/types/types";
import { useForm } from "@mantine/form";

export interface FormValues {
  descrizione: string;
  soggetto: string;
  prezzo: number;
}

interface ModalInserzioneProps {
  onClose: () => void;
  isOpen: boolean;
  modalData: Inserzione | null;
  onConfirm: ({
    soggetto,
    descrizione,
    prezzo,
  }: {
    soggetto: string;
    descrizione: string;
    prezzo: number;
  }) => Promise<void>;
}

function ModalInserzione({
  onClose,
  isOpen,
  onConfirm,
  modalData,
}: ModalInserzioneProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [soggetti, setSoggetti] = useState<SoggettoWithParentela[]>([]);
  const form = useForm<FormValues>({
    initialValues: { soggetto: "", descrizione: "", prezzo: 10 },
  });
  useModalInit(() => {
    const getSoggetti = async () => {
      setIsLoading(true);
      const listaSoggetti = await apiFetch.get<Soggetto[]>("/api/soggetti");
      setIsLoading(false);
      if (listaSoggetti.error) {
        return;
      } else {
        const soggettoWithParentela = listaSoggetti.data.map((soggetto) => ({
          soggetto: soggetto,
          parentela: null,
        }));
        setSoggetti(soggettoWithParentela);
      }
    };
    getSoggetti();
  }, isOpen);

  useEffect(() => {
    if (isOpen) {
      if (modalData) {
        form.setValues({
          descrizione: modalData.descrizione,
          prezzo: modalData.prezzo,
          soggetto: modalData.soggettoId,
        });
      } else {
        form.reset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalData, isOpen]);

  return (
    <ModalConferma
      confirmButton={{
        color: "teal",
        icon: <IconCheck size={14} />,
        label: "Conferma",
      }}
      onConfirm={async () => {
        await onConfirm(form.values);
      }}
      onClose={onClose}
      isOpen={isOpen}
      titolo={modalData ? "Modifica inserzione" : "Inserisci inserzione"}
    >
      <ComboboxSoggetto
        genitori={soggetti}
        loading={isLoading}
        label="Soggetto"
        onComboboxChange={(id) => {
          form.setFieldValue("soggetto", id);
        }}
        selected={form.values.soggetto}
      />
      <TextInput label="Descrizione" {...form.getInputProps("descrizione")} />
      <NumberInput
        label="Prezzo"
        allowDecimal
        decimalScale={2}
        {...form.getInputProps("prezzo")}
      />
    </ModalConferma>
  );
}

export default ModalInserzione;
