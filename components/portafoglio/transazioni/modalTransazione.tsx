import { dateParser } from "@/lib/DateParser";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import { useModalInit } from "@/lib/hooks";
import { ApiResponse, TransazioneWithCategoria } from "@/types/types";
import {
  Button,
  ComboboxItem,
  Group,
  Modal,
  NumberInput,
  SegmentedControl,
  Select,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { CategoriaSpesa } from "@prisma/client";
import {
  IconCalendar,
  IconCurrencyEuro,
  IconDeviceFloppy,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

const tipologie = [
  { value: "1", label: "Spesa" },
  { value: "0", label: "Incasso" },
];

export interface FormValues {
  categoriaId: string;
  descrizione: string;
  data: Date | null;
  prezzo: string;
  tipologia: string;
}

interface ModalTransazioneProps {
  isOpen: boolean;
  annulla: () => void;
  submit: (values: FormValues) => Promise<void>;
  transazione: TransazioneWithCategoria | null;
}
function ModalTransazione({
  isOpen,
  annulla,
  submit,
  transazione,
  ...others
}: ModalTransazioneProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [categorie, setCategorie] = useState<ComboboxItem[]>([]);

  useModalInit(getCategorie, isOpen);

  useEffect(() => {
    if (isOpen) {
      if (transazione) {
        form.setValues({
          categoriaId: transazione.categoriaId.toString(),
          descrizione: transazione.descrizione || "",
          data: new Date(transazione.data),
          prezzo: Math.abs(transazione.prezzo).toString(),
          tipologia: transazione.prezzo <= 0 ? "1" : "0",
        });
      } else {
        form.reset();
      }
    }
  }, [isOpen, transazione]);

  function getCategorie() {
    async function categorieFn() {
      const result = await apiFetch.get<CategoriaSpesa[]>("/api/categorie");
      if (!result.error) {
        setCategorie(
          result.data.map((categoria) => ({
            label: categoria.nome,
            value: categoria.id.toString(),
          }))
        );
        //form.setFieldValue("categoriaId", res?.[0].id.toString());
      } else {
        showNotification({ message: result.message });
      }
    }
    categorieFn();
  }

  const form = useForm<FormValues>({
    validateInputOnBlur: true,
    initialValues: {
      categoriaId: "",
      descrizione: "",
      data: null,
      prezzo: "0",
      tipologia: tipologie[0].value,
    },
    validate: {
      prezzo: (prezzo) => (prezzo.length == 0 ? "Inserire Prezzo" : null),
      categoriaId: (categoriaId) =>
        categoriaId == null ? "Inserire Categoria" : null,
      data: (data) => (data == null ? "Inserire Data" : null),
    },
  });

  return (
    <Modal
      title={transazione ? "Modifica Transazione" : "Aggiungi Transazione"}
      opened={isOpen}
      onClose={annulla}
      centered
      {...others}
    >
      <form
        onSubmit={form.onSubmit(async () => {
          setIsLoading(true);
          await submit(form.values);
          setIsLoading(false);
          annulla();
        })}
      >
        <SegmentedControl
          size="xs"
          data={tipologie}
          {...form.getInputProps("tipologia")}
        />
        <SimpleGrid cols={2} mt={"md"}>
          <Select
            label="Categoria"
            data={categorie}
            allowDeselect={false}
            {...form.getInputProps("categoriaId")}
          ></Select>
          <TextInput
            label="Descrizione"
            {...form.getInputProps("descrizione")}
          />

          <DateInput
            label="Data transazione"
            {...form.getInputProps("data")}
            valueFormat="DD/MM/YYYY"
            dateParser={dateParser}
            leftSection={<IconCalendar size={16} />}
          ></DateInput>

          <NumberInput
            label="Prezzo"
            fixedDecimalScale={true}
            decimalScale={2}
            allowNegative={false}
            hideControls
            leftSection={<IconCurrencyEuro size={16} />}
            {...form.getInputProps("prezzo")}
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

export default ModalTransazione;
