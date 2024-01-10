import { dateParser } from "@/lib/DateParser";
import { showNotification } from "@/lib/helper";
import {
  ApiResponse,
  CovataWithGenitori,
  SoggettoWithGenitori,
} from "@/types/types";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  SimpleGrid,
  Switch,
  SegmentedControl,
  ComboboxItem,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { Soggetto } from "@prisma/client";
import {
  IconCalendar,
  IconCheck,
  IconDeviceFloppy,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import ComboboxGenitori from "../covate/comboboxGenitori";

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
  submit: (values: any) => Promise<void>;
}

function ModalReport({ isOpen, annulla, submit }: ModalReportProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [segmentValue, setSegmentValue] = useState("");

  interface FormValues {
    dataInizio: Date | null;
    dataFine: Date | null;
    tipologia: string;
  }

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
    const now = new Date();
    const today = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
    );
    let date = new Date(today);
    console.log("Inizio:", form.values.dataInizio?.getTime());
    console.log("Fine:", form.values.dataFine?.getTime());
    console.log("TODAY:", today.getTime());
    if (form.values.dataFine?.getTime() != today.getTime()) {
      return "";
    }
    date.setMonth(today.getMonth() - 1);
    if (form.values.dataInizio?.getTime() == date.getTime()) {
      return "1";
    }
    date.setMonth(today.getMonth() - 3);
    if (form.values.dataInizio?.getTime() == date.getTime()) {
      return "3";
    }
    date.setMonth(today.getMonth() - 6);
    if (form.values.dataInizio?.getTime() == date.getTime()) {
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
          await submit(form.values);
          setIsLoading(false);
          annulla();
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
