"use client";
import { showNotification } from "@/lib/helper";
import { useModalInit } from "@/lib/hooks";
import {
  Button,
  Combobox,
  ComboboxItem,
  Group,
  Loader,
  Modal,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface ModalSelezionaSoggettoProps {
  isOpen: boolean;
  annulla: () => void;
  getSoggetti: () => Promise<ComboboxItem[]>;
  submit: (value: string) => Promise<void>;
  description?: string;
}
function ModalSelezionaSoggetto({
  isOpen,
  annulla,
  getSoggetti,
  submit,
  description,
}: ModalSelezionaSoggettoProps) {
  const [isSelectLoading, setIsSelectLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [soggettiItems, setSoggettiItems] = useState<ComboboxItem[]>([]);

  useModalInit(() => {
    async function _getSoggetti() {
      setIsSelectLoading(true);
      try {
        setSoggettiItems(await getSoggetti());
      } catch (error) {
        if (error instanceof Error) {
          showNotification({ message: error.message });
        } else {
          showNotification({ message: "Errore nell'ottenere i soggetti" });
        }
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

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen]);

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
          description={description}
          data={soggettiItems}
          {...form.getInputProps("soggettoId")}
          rightSection={
            isSelectLoading ? <Loader size={18} /> : <Combobox.Chevron />
          }
          searchable
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
            leftSection={<IconCheck size={14} />}
            type="submit"
            loading={isLoading}
          >
            Seleziona
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default ModalSelezionaSoggetto;
