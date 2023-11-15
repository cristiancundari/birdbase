"use client";
import {
  Button,
  Group,
  Select,
  TextInput,
  Modal,
  SimpleGrid,
  NumberInput,
  Image,
  ActionIcon,
  Box,
} from "@mantine/core";

import errorNotificationClasses from "@/styles/errorNotification.module.css";
import { DateInput } from "@mantine/dates";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { dateParser } from "@/lib/DateParser";
import Upload from "../upload";
import { FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { Gara, Nazione } from "@prisma/client";
import { imgPath, showNotification } from "@/lib/helper";

export interface FormValues {
  titolo: string;
  tipologia: string;
  dataEvento: Date | null;
  citta: string;
  nazioneId: string;
  prezzo: string;
  capienza: string;
  immagine: string | null;
}

interface PropsType {
  isOpen: boolean;
  annulla: () => void;
  submit: (values: any) => Promise<void>;
  modalData: Gara | null;
}

function ModalGara({ isOpen, annulla, submit, modalData }: PropsType) {
  const [isLoading, setIsLoading] = useState(false);
  const [nazioni, setNazioni] = useState<{ value: string; label: string }[]>(
    []
  );
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const form = useForm<FormValues>({
    validateInputOnBlur: true,
    initialValues: {
      titolo: "",
      tipologia: "",
      dataEvento: null,
      citta: "",
      nazioneId: "0",
      prezzo: "0",
      capienza: "1",
      immagine: null,
    },
    validate: {
      titolo: (titolo) => (titolo.length == 0 ? "Inserire Titolo" : null),
      dataEvento: (data) => (data == null ? "Inserire Data" : null),
      citta: (citta) => (citta.length == 0 ? "Inserire la città" : null),
    },
  });

  useEffect(getNazioni, []);

  useEffect(() => {
    if (isOpen) {
      if (modalData) {
        form.setValues({
          titolo: modalData.titolo,
          tipologia: modalData.tipologia,
          dataEvento: modalData.dataEvento,
          citta: modalData.citta,
          nazioneId: modalData.nazioneId.toString(),
          prezzo: modalData.prezzo.toString(),
          capienza: modalData.capienza.toString(),
          immagine: modalData.immagine,
        });
      } else {
        form.reset();
      }
      setFiles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalData, isOpen]);

  function getNazioni() {
    const nazioni = async () => {
      const result = await fetch("/api/nazioni");
      if (!result.ok) {
        showNotification({
          message: "Impossibile ottenere le nazioni dal server",
        });
        return null;
      }
      const resultJson = await result.json();
      const nazioni: Nazione[] = resultJson.result;
      const nazioniSelect = nazioni.map((nazione) => ({
        value: nazione.id.toString(),
        label: nazione.nome,
      }));
      setNazioni(nazioniSelect);
    };
    nazioni();
  }

  const previews = files.map((file) => URL.createObjectURL(file));

  let preview = null;
  if (previews.length > 0) {
    preview = previews[0];
  } else if (form.values.immagine !== null) {
    preview = imgPath + form.values.immagine;
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
          await submit({ form: form.values, imgFile: files?.[0] });
          setIsLoading(false);
          annulla();
        })}
      >
        {preview ? (
          <Box pos="relative">
            <Image src={preview} alt="Immagine" height={160} />
            <ActionIcon
              color="dark"
              variant="white"
              onClick={() => {
                form.setFieldValue("immagine", null);
                setFiles([]);
              }}
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
            onReject={() => {
              showNotification({
                title: "Errore Upload",
                message: "Impossibile utilizzare il file selezionato",
              });
            }}
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
            {...form.getInputProps("dataEvento")}
            valueFormat="DD/MM/YYYY"
            dateParser={dateParser}
          ></DateInput>

          <TextInput label="Città" {...form.getInputProps("citta")} />

          <Select
            {...form.getInputProps("nazioneId")}
            label="Nazione"
            data={nazioni}
            allowDeselect={false}
            searchable
            nothingFoundMessage="Nessun risultato"
          ></Select>

          <NumberInput
            label="Prezzo"
            allowNegative={false}
            hideControls
            decimalScale={2}
            fixedDecimalScale
            decimalSeparator=","
            leftSection="€"
            {...form.getInputProps("prezzo")}
          />
          <NumberInput
            label="Capienza"
            allowNegative={false}
            allowDecimal={false}
            hideControls
            {...form.getInputProps("capienza")}
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

export default ModalGara;
