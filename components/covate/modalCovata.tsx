import { dateParser } from "@/lib/DateParser";
import { showNotification } from "@/lib/helper";
import { ApiResponse } from "@/types/types";
import {
  Button,
  Group,
  Modal,
  Select,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { Soggetto } from "@prisma/client";
import { IconCalendar, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

export interface CovataFormValues {
  padre: string[];
  madre: string[];
  dataConvata: Date;
  uovaDeposte: string;
  uovaSchiuse: string;
}

interface modalCovataValues {
  isOpen: boolean;
  annulla: () => void;
  modalData: any;
}

function ModalCovata({ isOpen, annulla, modalData }: modalCovataValues) {
  const [isLoading, setIsLoading] = useState(false);
  const [padre, setPadre] = useState<{ value: string; label: string }[]>([]);
  const [madre, setMadre] = useState<{ value: string; label: string }[]>([]);
  const form = useForm({
    initialValues: {
      padre: "",
      madre: "",
      dataCovata: null,
      uovaDeposte: "0",
      uovaSchiuse: "0",
    },
    validate: {
      padre: (padre) => (padre == null ? "Inserire il padre" : null),
      madre: (madre) => (madre == null ? "Inserire la madre" : null),
      dataCovata: (dataCovata) =>
        dataCovata == null ? "Inserire la data" : null,
    },
  });

  useEffect(getPadreMadre, []);

  function getPadreMadre() {
    const listaPadreMadre = async () => {
      const response = await fetch("/api/covate/genitori");
      if (!response.ok) {
        showNotification({
          message: "Impossibile ottenere i dati dal database.",
        });
        return null;
      }
      const result = await response.json();
      const resMadre: Soggetto[] = result.result.madre;
      const resPadre: Soggetto[] = result.result.padre;

      const padreSelect = resPadre.map((padre) => ({
        value: padre.id,
        label: padre.rna + padre.numero,
      }));
      const madreSelect = resMadre.map((madre) => ({
        value: madre.id,
        label: madre.rna + madre.numero,
      }));
      //TODO set padre e madre
      setPadre(padreSelect);
      setMadre(madreSelect);
    };

    listaPadreMadre();
  }

  return (
    <Modal
      opened={isOpen}
      onClose={annulla}
      title={modalData == null ? "Aggiungi Gara" : "Modifica Gara"}
      centered
    >
      <form
        onSubmit={form.onSubmit(async () => {
          setIsLoading(true);
          //effettuare la richiesta al server
          setIsLoading(false);
          annulla();
        })}
      >
        <SimpleGrid cols={2} mt={"md"}>
          <Select
            {...form.getInputProps("padre")}
            label="Padre"
            data={padre}
            allowDeselect={false}
            searchable
            nothingFoundMessage="Nessun risultato"
          ></Select>
          <Select
            {...form.getInputProps("madre")}
            label="Madre"
            data={madre}
            allowDeselect={false}
            searchable
            nothingFoundMessage="Nessun risultato"
          ></Select>

          <DateInput
            label="Data Covata"
            {...form.getInputProps("dataCovata")}
            valueFormat="DD/MM/YYYY"
            dateParser={dateParser}
            leftSection={<IconCalendar size={16} />}
          ></DateInput>

          <TextInput label="Gabbia" {...form.getInputProps("gabbia")} />

          <TextInput
            label="Uova deposte"
            {...form.getInputProps("uovaDeposte")}
          ></TextInput>

          <TextInput
            label="Uova schiuse"
            {...form.getInputProps("uovaSchiuse")}
          ></TextInput>
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
