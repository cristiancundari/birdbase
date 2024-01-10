"use client";
import {
  ActionIcon,
  Box,
  Button,
  Combobox,
  ComboboxItem,
  Group,
  Image,
  Loader,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  TextInput,
} from "@mantine/core";

import { dateParser } from "@/lib/DateParser";
import { apiFetch } from "@/lib/apiFetch";
import { imgPath, showNotification } from "@/lib/helper";
import { DateInput } from "@mantine/dates";
import { FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { $Enums, Gara, Nazione } from "@prisma/client";
import {
  IconCalendar,
  IconCurrencyEuro,
  IconDeviceFloppy,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Upload from "../Upload";
import { useModalInit } from "@/lib/hooks";

const garaStatesArr = [
  {
    value: $Enums.GaraStatus.BOZZA,
    label: "Bozza",
  },
  {
    value: $Enums.GaraStatus.PUBBLICA,
    label: "Pubblicata",
  },
  {
    value: $Enums.GaraStatus.VALUTAZIONE,
    label: "Da valutare",
  },
  {
    value: $Enums.GaraStatus.COMPLETATA,
    label: "Completata",
  },
];

export interface FormValues {
  titolo: string;
  tipologia: string;
  data: Date | null;
  citta: string;
  nazioneId: string;
  prezzo: string;
  capienza: string;
  immagine: string | null;
  stato: string;
}

interface ModalGaraProps {
  isOpen: boolean;
  annulla: () => void;
  submit: (values: any) => Promise<void>;
  modalData: Gara | null;
}

function ModalGara({ isOpen, annulla, submit, modalData }: ModalGaraProps) {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [garaStates, setGaraStates] = useState<ComboboxItem[]>(garaStatesArr);

  const [nazioni, setNazioni] = useState<ComboboxItem[]>([]);
  const [isNazioniLoading, setIsNazioniLoading] = useState(false);

  const [files, setFiles] = useState<FileWithPath[]>([]);

  const form = useForm<FormValues>({
    validateInputOnBlur: true,
    initialValues: {
      titolo: "",
      tipologia: "",
      data: null,
      citta: "",
      nazioneId: "0",
      prezzo: "0",
      capienza: "1",
      immagine: null,
      stato: $Enums.GaraStatus.BOZZA,
    },
    validate: {
      titolo: (titolo) => (titolo.length == 0 ? "Inserire Titolo" : null),
      data: (data) => (data == null ? "Inserire Data" : null),
      citta: (citta) => (citta.length == 0 ? "Inserire la città" : null),
    },
  });

  const removeImageHandler = () => {
    form.setFieldValue("immagine", null);
    setFiles([]);
  };

  const onUploadReject = () => {
    showNotification({
      title: "Errore Upload",
      message: "Impossibile utilizzare il file selezionato",
    });
  };

  const onFormSubmit = form.onSubmit(async () => {
    setIsSubmitLoading(true);
    await submit({ form: form.values, imgFile: files?.[0] });
    setIsSubmitLoading(false);
    annulla();
  });

  const getNazioni = async () => {
    const result = await apiFetch.get<Nazione[]>("/api/nazioni");
    if (result.error) {
      showNotification({
        message: result.message,
      });
    } else {
      const nazioniSelect = result.data.map((nazione) => ({
        value: nazione.id.toString(),
        label: nazione.nome,
      }));
      setNazioni(nazioniSelect);
    }
  };

  useModalInit(() => {
    const _getNazioni = async () => {
      setIsNazioniLoading(true);
      await getNazioni();
      setIsNazioniLoading(false);
    };
    _getNazioni();
  }, isOpen);

  useEffect(() => {
    if (isOpen) {
      if (modalData) {
        form.setValues({
          titolo: modalData.titolo,
          tipologia: modalData.tipologia,
          data: modalData.data,
          citta: modalData.citta,
          nazioneId: modalData.nazioneId.toString(),
          prezzo: modalData.prezzo.toString(),
          capienza: modalData.capienza.toString(),
          immagine: modalData.immagine,
          stato: modalData.stato,
        });
        if (modalData.stato !== $Enums.GaraStatus.BOZZA) {
          //Disabilita l'opzione Bozza se la gara è stata già pubblicata
          setGaraStates(
            garaStatesArr.map((i) =>
              i.value == $Enums.GaraStatus.BOZZA ? { ...i, disabled: true } : i
            )
          );
        }
      } else {
        form.reset();
        setGaraStates(garaStatesArr);
      }
      setFiles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalData, isOpen]);

  let preview = files.length > 0 ? URL.createObjectURL(files[0]) : null;

  if (preview == null && form.values.immagine !== null) {
    preview = imgPath + form.values.immagine;
  }

  return (
    <Modal
      opened={isOpen}
      onClose={annulla}
      title={modalData == null ? "Aggiungi Gara" : "Modifica Gara"}
      centered
    >
      <form onSubmit={onFormSubmit}>
        {preview ? (
          <Box pos="relative">
            <Image src={preview} alt="Immagine" height={160} />
            <ActionIcon
              color="dark"
              variant="white"
              onClick={removeImageHandler}
              radius="xl"
              pos="absolute"
              top="0"
              right="0"
              style={{ boxShadow: "0px 0px 4px 1px rgba(0,0,0,0.3)" }}
            >
              <IconX size="20" color="#555" />
            </ActionIcon>
          </Box>
        ) : (
          <Upload
            multiple={false}
            onDrop={setFiles}
            onReject={onUploadReject}
            w="100%"
          ></Upload>
        )}

        <SimpleGrid cols={2} mt={"md"}>
          <TextInput label="Titolo" {...form.getInputProps("titolo")} />
          <TextInput
            label="Tipologia"
            {...form.getInputProps("tipologia")}
          ></TextInput>

          <DateInput
            label="Data Evento"
            {...form.getInputProps("data")}
            valueFormat="DD/MM/YYYY"
            dateParser={dateParser}
            leftSection={<IconCalendar size={16} />}
          ></DateInput>

          <TextInput label="Città" {...form.getInputProps("citta")} />

          <Select
            {...form.getInputProps("nazioneId")}
            label="Nazione"
            data={nazioni}
            allowDeselect={false}
            searchable
            nothingFoundMessage="Nessun risultato"
            rightSection={
              isNazioniLoading ? <Loader size={18} /> : <Combobox.Chevron />
            }
          ></Select>

          <NumberInput
            label="Prezzo"
            allowNegative={false}
            hideControls
            decimalScale={2}
            fixedDecimalScale
            leftSection={<IconCurrencyEuro size={16} />}
            {...form.getInputProps("prezzo")}
          />

          <NumberInput
            label="Capienza"
            allowNegative={false}
            allowDecimal={false}
            hideControls
            {...form.getInputProps("capienza")}
          />

          <Select
            {...form.getInputProps("stato")}
            label="Stato"
            data={garaStates}
            allowDeselect={false}
            rightSection={<Combobox.Chevron />}
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
            loading={isSubmitLoading}
          >
            Salva
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default ModalGara;
