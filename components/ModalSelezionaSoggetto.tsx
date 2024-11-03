"use client";
import { formatAnelletto, showNotification } from "@/lib/helper";
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
import { Soggetto } from "@prisma/client";
import { IconCheck, IconX } from "@tabler/icons-react";
import assert from "assert";
import { useEffect, useState } from "react";

interface ModalSelezionaSoggettoProps {
  isOpen: boolean;
  annulla: () => void;
  isLoading: boolean;
  soggetti: Soggetto[];
  submit: (soggetto: Soggetto) => Promise<void>;
  description?: string;
}
function ModalSelezionaSoggetto({
  isOpen,
  annulla,
  isLoading,
  soggetti,
  submit,
  description,
}: ModalSelezionaSoggettoProps) {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const form = useForm({
    initialValues: {
      soggettoId: "",
    },
    validate: {
      soggettoId: (value) => value === "" && "Seleziona un soggetto",
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
          setIsSubmitLoading(true);
          const soggetto = soggetti.find((s) => s.id == form.values.soggettoId);
          assert(soggetto);
          await submit(soggetto);
          setIsSubmitLoading(false);
          annulla();
        })}
      >
        <Select
          label="Soggetto"
          description={description}
          data={soggetti.map((s) => ({
            value: s.id,
            label: formatAnelletto(s.rna, s.numero, s.anno),
          }))}
          {...form.getInputProps("soggettoId")}
          rightSection={isLoading ? <Loader size={18} /> : <Combobox.Chevron />}
          searchable
          data-testid="soggetto-select"
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
            loading={isSubmitLoading}
          >
            Seleziona
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default ModalSelezionaSoggetto;
