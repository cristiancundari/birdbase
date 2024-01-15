"use client";
import { dateParser } from "@/lib/DateParser";
import { formatData } from "@/lib/helper";

import {
  Button,
  Group,
  Modal,
  SimpleGrid,
  SegmentedControl,
  ComboboxItem,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconCalendar, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const tipologie: ComboboxItem[] = [
  { value: "2", label: "Tutti" },
  { value: "1", label: "Spesa" },
  { value: "0", label: "Incasso" },
];
const ranges: ComboboxItem[] = [
  { value: "1", label: "Ultimo mese" },
  { value: "3", label: "Ultimi 3 mesi" },
  { value: "6", label: "Ultimi 6 mesi" },
];

interface ModalReportProps {
  isOpen: boolean;
  annulla: () => void;
  submit: (values: any) => void;
}

export interface FormValues {
  dataInizio: Date | null;
  dataFine: Date | null;
  tipologia: string;
}

function ModalReport({ isOpen, annulla, submit }: ModalReportProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [segmentValue, setSegmentValue] = useState<string>("");

  const form = useForm<FormValues>({
    initialValues: {
      dataInizio: null,
      dataFine: null,
      tipologia: tipologie[0].value,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen]);

  useEffect(() => {
    const result = checkDate();
    setSegmentValue(result);
  }, [form.values.dataInizio, form.values.dataFine]);

  const checkDate = () => {
    const dataInizio = form.values.dataInizio
      ? formatData(form.values.dataInizio)
      : "";
    const dataFine = form.values.dataFine
      ? formatData(form.values.dataFine)
      : "";
    const now = new Date();
    const today = formatData(new Date());
    if (dataFine != today) {
      return "";
    }
    now.setMonth(now.getMonth() - 1);
    if (dataInizio == formatData(now)) {
      return "1";
    }
    now.setMonth(now.getMonth() - 2);
    if (dataInizio == formatData(now)) {
      return "3";
    }
    now.setMonth(now.getMonth() - 3);
    if (dataInizio == formatData(now)) {
      return "6";
    }
    return "";
  };

  const dataHandler = (value: string) => {
    setSegmentValue(value);
    const today = new Date();
    let dataIniziale = new Date();
    dataIniziale.setMonth(today.getMonth() - Number(value));
    form.setFieldValue("dataInizio", dataIniziale);
    form.setFieldValue("dataFine", today);
  };

  return (
    <Modal
      opened={isOpen}
      onClose={annulla}
      title={"Genera Report"}
      centered
      size="lg"
    >
      <form
        onSubmit={form.onSubmit(async () => {
          setIsLoading(true);
          submit(form.values);
        })}
      >
        <Group justify="space-between">
          <SegmentedControl
            size="xs"
            data={tipologie}
            {...form.getInputProps("tipologia")}
          />
          <SegmentedControl
            size="xs"
            data={ranges}
            value={segmentValue}
            onChange={dataHandler}
          />
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2 }} mt={"md"}>
          <DateInput
            label="Data Inizio"
            {...form.getInputProps("dataInizio")}
            valueFormat="DD/MM/YYYY"
            dateParser={dateParser}
            leftSection={<IconCalendar size={16} />}
          ></DateInput>
          <DateInput
            label="Data Fine"
            {...form.getInputProps("dataFine")}
            valueFormat="DD/MM/YYYY"
            dateParser={dateParser}
            leftSection={<IconCalendar size={16} />}
          ></DateInput>
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
            Invio
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default ModalReport;
