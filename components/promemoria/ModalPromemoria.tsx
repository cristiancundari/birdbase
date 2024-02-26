"use client";
import {
  Button,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Switch,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { $Enums, Priorita, Promemoria } from "@prisma/client";
import {
  IconCalendar,
  IconCheck,
  IconDeviceFloppy,
  IconX,
} from "@tabler/icons-react";
import { it } from "date-fns/locale";
import React, { useEffect, useState } from "react";

export interface FormValues {
  titolo: string;
  descrizione: string;
  dataOra: Date | null;
  priorita: Priorita | null;
  completato: boolean;
}
interface ModalPromemoriaProps {
  isOpen: boolean;
  annulla: () => void;
  submit: (value: FormValues) => Promise<void>;
  modalData: Promemoria | null;
}
function ModalPromemoria({
  isOpen,
  annulla,
  submit,
  modalData,
}: ModalPromemoriaProps) {
  useEffect(() => {
    if (isOpen) {
      if (modalData) {
        console.log(modalData);
        const date = modalData.data.toISOString().split("T");
        const time = modalData.ora.toISOString().split("T");
        const date1 = date[0] + "T" + time[1];
        const data = new Date(date1);
        form.setValues({
          completato: modalData.completato,
          descrizione: modalData.descrizione,
          priorita: modalData.priorita,
          titolo: modalData.titolo,
          dataOra: data,
        });
      } else {
        form.reset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalData, isOpen]);

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    validateInputOnBlur: true,
    initialValues: {
      titolo: "",
      descrizione: "",
      dataOra: null,
      priorita: null,
      completato: false,
    },
    validate: {
      titolo: (titolo) => (titolo.length == 0 ? "Inserire un titolo" : null),
      dataOra: (dataOra) => (dataOra == null ? "Inserire Data" : null),
    },
  });
  return (
    <Modal
      title={modalData == null ? "Aggiungi Promemoria" : "Modifica Promemoria"}
      opened={isOpen}
      onClose={annulla}
      centered
    >
      <form
        onSubmit={form.onSubmit(async () => {
          setIsLoading(true);
          await submit(form.values);
          setIsLoading(false);
          annulla();
        })}
      >
        <Switch
          checked={form.values.completato}
          onChange={(event) =>
            form.setFieldValue("completato", event.currentTarget.checked)
          }
          color="teal"
          size="sm"
          label="completato"
          thumbIcon={
            form.values.completato && <IconCheck size={14} color="teal" />
          }
        />
        <SimpleGrid cols={2} mt={"md"}>
          <TextInput label="Titolo" {...form.getInputProps("titolo")} />
          <TextInput
            label="Descrizione"
            {...form.getInputProps("descrizione")}
          />
          <DateTimePicker
            label="Data e Ora"
            {...form.getInputProps("dataOra")}
            valueFormat="DD/MM/YYYY HH:mm"
            leftSection={<IconCalendar size={16} />}
          />
          <Select
            label="Priorità"
            data={Object.values($Enums.Priorita)}
            allowDeselect={false}
            {...form.getInputProps("priorita")}
          ></Select>
        </SimpleGrid>

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

export default ModalPromemoria;
