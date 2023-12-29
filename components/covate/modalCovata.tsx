import { dateParser } from "@/lib/DateParser";
import { formatData, showNotification } from "@/lib/helper";
import { ApiResponse, CovataWithGenitori } from "@/types/types";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Switch,
  TextInput,
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
import React, { useEffect, useState } from "react";
import ComboboxGenitori, { GenitoriItem } from "./comboboxGenitori";
import { apiFetch } from "@/lib/apiFetch";

export interface CovataFormValues {
  padre: string;
  madre: string;
  dataCovata: Date | null;
  uovaDeposte: string;
  uovaSchiuse: string;
  gabbia: string;
  completata: boolean;
}

interface ModalCovataProps {
  isOpen: boolean;
  annulla: () => void;
  modalData: CovataWithGenitori | null;
  submit: (values: CovataFormValues) => Promise<void>;
}

function ModalCovata({ isOpen, annulla, modalData, submit }: ModalCovataProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [padre, setPadre] = useState<GenitoriItem[]>([]);
  const [madre, setMadre] = useState<GenitoriItem[]>([]);
  const form = useForm<CovataFormValues>({
    initialValues: {
      padre: "",
      madre: "",
      dataCovata: null,
      uovaDeposte: "0",
      uovaSchiuse: "0",
      gabbia: "",
      completata: false,
    },
    validate: {
      padre: (padre) => (padre == null ? "Inserire il padre" : null),
      madre: (madre) => (madre == null ? "Inserire la madre" : null),
      dataCovata: (dataCovata) =>
        dataCovata == null ? "Inserire la data" : null,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (modalData) {
        form.setValues({
          padre: modalData.padre.id,
          madre: modalData.madre.id,
          dataCovata: modalData.data,
          uovaDeposte: modalData.uovaDeposte.toString(),
          uovaSchiuse: modalData.uovaSchiuse.toString(),
          completata: modalData.completata,
          gabbia: modalData.gabbia?.toString() || "",
        });
      } else {
        form.reset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalData, isOpen]);
  useEffect(getPadreMadre, []);

  function getPadreMadre() {
    const listaPadreMadre = async () => {
      const response = await fetch("/api/soggetti");
      const result: ApiResponse<Soggetto[]> = await response.json();
      if (result.error) {
        showNotification({
          message: result.message,
        });
        return null;
      }

      const resMadre: GenitoriItem[] = result.result
        .filter((item: Soggetto) => item.sesso == false)
        .map((s) => ({
          soggetto: s,
          parentela: null,
        }));
      const resPadre: GenitoriItem[] = result.result
        .filter((item: Soggetto) => item.sesso == true)
        .map((s) => ({
          soggetto: s,
          parentela: null,
        }));

      setPadre(resPadre);
      setMadre(resMadre);
    };

    listaPadreMadre();
  }

  return (
    <Modal
      opened={isOpen}
      onClose={annulla}
      title={modalData == null ? "Aggiungi Covata" : "Modifica Covata"}
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
        <Switch
          checked={form.values.completata}
          onChange={(event) =>
            form.setFieldValue("completata", event.currentTarget.checked)
          }
          color="teal"
          size="sm"
          label="Completata"
          thumbIcon={
            form.values.completata && <IconCheck size={14} color="teal" />
          }
        />
        <SimpleGrid cols={{ base: 1, sm: 2 }} mt={"md"}>
          <ComboboxGenitori
            label="Padre"
            genitori={padre}
            onComboboxChange={(id) => form.setFieldValue("padre", id)}
            selected={form.values.padre}
          />
          <ComboboxGenitori
            label="Madre"
            genitori={madre}
            onComboboxChange={(id) => form.setFieldValue("madre", id)}
            selected={form.values.madre}
          />
          <DateInput
            label="Data Covata"
            {...form.getInputProps("dataCovata")}
            valueFormat="DD/MM/YYYY"
            dateParser={dateParser}
            leftSection={<IconCalendar size={16} />}
          ></DateInput>

          <NumberInput
            allowNegative={false}
            allowDecimal={false}
            hideControls
            label="Gabbia"
            {...form.getInputProps("gabbia")}
          />

          <NumberInput
            allowNegative={false}
            allowDecimal={false}
            hideControls
            label="Uova deposte"
            {...form.getInputProps("uovaDeposte")}
          />
          <NumberInput
            allowNegative={false}
            allowDecimal={false}
            hideControls
            label="Uova schiuse"
            {...form.getInputProps("uovaSchiuse")}
          />
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

export default ModalCovata;
