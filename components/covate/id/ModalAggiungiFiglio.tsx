"use client";
import { apiFetch } from "@/lib/apiFetch";
import { formatAnelletto, showNotification } from "@/lib/helper";
import { useModalInit } from "@/lib/hooks";
import { Button, Combobox, ComboboxItem, Group, Loader, Modal, Popover, Select, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Soggetto } from "@prisma/client";
import { IconDeviceFloppy, IconInfoCircle, IconX } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

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
  const [isSelectLoading, setIsSelectLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [soggettiItems, setSoggettiItems] = useState<ComboboxItem[]>([]);

  useModalInit(() => {
    async function _getSoggetti() {
      setIsSelectLoading(true);
      const result = await apiFetch.get<Soggetto[]>("/api/soggetti?covataId=")
      if (result.error) {
        showNotification({message:result.message})
      } else {
        setSoggettiItems(result.data.map((item)=>({value: item.id, label: formatAnelletto(item.rna, item.numero, item.anno)})))
      }
      setIsSelectLoading(false);
    }
    _getSoggetti();
  }, isOpen);

  const form = useForm({
    initialValues: {
      soggettoId: "",
    },
  });

  useEffect(()=>{
    if(isOpen) {
      form.reset();
    }
  },[isOpen])

  return (
    <Modal
      opened={isOpen}
      onClose={annulla}
      title={"Seleziona soggetto"}
      centered
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
          description="Sono visualizzati solo i soggetti figli di nessuna covata"
          data={soggettiItems}
          {...form.getInputProps("soggettoId")}
          rightSection={
            isSelectLoading ? <Loader size={18} /> : <Combobox.Chevron />
          }
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
