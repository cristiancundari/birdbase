"use client";
import { useModalInit } from "@/lib/hooks";
import { Button, Group, Modal, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import React, { useState } from "react";

interface ModalAggiungiFiglioProps {
  isOpen: boolean;
  annulla: () => void;
  covataId: number;
  submit: (value: string) => Promise<void>;
}
function ModalAggiungiFiglio({
  isOpen,
  annulla,
  covataId,
  submit,
}: ModalAggiungiFiglioProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [soggetti, setSoggetti] = useState([]);

  useModalInit(() => {
    console.log("Only first time");
  }, isOpen);

  const form = useForm({
    initialValues: {
      soggettoId: "",
    },
  });

  return (
    <Modal
      opened={isOpen}
      onClose={annulla}
      title={"Seleziona soggetto"}
      centered
      size="lg"
    >
      <form
        onSubmit={form.onSubmit(async () => {
          setIsLoading(true);
          await submit(form.values.soggettoId);
          setIsLoading(false);
          annulla();
        })}
      >
        <Select
          label="Soggetto"
          data={soggetti}
          {...form.getInputProps("soggettoId")}
        />

        <Group mt={"lg"} gap="md" justify="flex-end">
          <Button
            variant="outline"
            color="gray"
            onClick={annulla}
            leftSection={<IconX size={14} />}
          >
            Annulla
          </Button>
          <Button
            color="green"
            leftSection={<IconDeviceFloppy size={14} />}
            type="submit"
            loading={isLoading}
          >
            Salva
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default ModalAggiungiFiglio;
