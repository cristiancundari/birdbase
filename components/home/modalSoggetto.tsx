"use client";
import {
  Button,
  Group,
  Select,
  TextInput,
  Modal,
  SimpleGrid,
  NumberInput,
  Avatar,
  Center,
  Box,
  ActionIcon,
} from "@mantine/core";

import errorNotificationClasses from "@/styles/errorNotification.module.css";
import { DateInput } from "@mantine/dates";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { Sesso } from "@/types/types";
import { Soggetto } from ".prisma/client";
import { dateParser } from "@/lib/DateParser";
import Upload from "../upload";
import { FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";

interface FormValues {
  rna: string;
  numero: string;
  dataNascita: Date | null;
  gabbia: number | null;
  sesso: Sesso;
  avatar: string | null;
}

interface PropsType {
  isOpen: boolean;
  annulla: () => void;
  submit: (values: any) => Promise<void>;
  modalData: Soggetto | null;
}

function ModalSoggetto({ isOpen, annulla, submit, modalData }: PropsType) {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const form = useForm<FormValues>({
    validateInputOnBlur: true,
    initialValues: {
      rna: "",
      numero: "",
      dataNascita: null,
      gabbia: null,
      sesso: Sesso.InAttesa,
      avatar: null,
    },
    validate: {
      rna: (value) => (value.length == 0 ? "Inserire RNA" : null),
    },
  });

  useEffect(() => {
    form.setFieldValue("rna", modalData?.rna || "");
    form.setFieldValue("numero", modalData?.numero || "");
    form.setFieldValue("gabbia", modalData?.gabbia || null);
    const sesso = modalData?.sesso;
    form.setFieldValue(
      "sesso",
      sesso == true
        ? Sesso.Maschio
        : sesso == false
        ? Sesso.Femmina
        : Sesso.InAttesa
    );
    form.setFieldValue("dataNascita", modalData?.dataNascita || null);
    form.setFieldValue("avatar", modalData?.avatar || null);
    setFiles([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalData]);

  useEffect(() => {
    if (isOpen && !modalData) {
      form.reset();
      setFiles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const previews = files.map((file) => URL.createObjectURL(file));

  let preview = null;
  if (previews.length > 0) {
    preview = previews[0];
  } else if (form.values.avatar !== null) {
    preview = `https://yhpgtvnrcgqnqdkdbnqo.supabase.co/storage/v1/object/public/img/${form.values.avatar}`;
  }

  return (
    <Modal
      opened={isOpen}
      onClose={annulla}
      title={modalData == null ? "Aggiungi Soggetto" : "Modifica Soggetto"}
      centered
    >
      <form
        onSubmit={form.onSubmit(async () => {
          setIsLoading(true);
          await submit({ ...form.values, avatarFile: files?.[0] });
          setIsLoading(false);
          annulla();
        })}
      >
        <Center py="xs">
          {preview ? (
            <Box pos="relative">
              <Avatar variant="filled" size="xl" src={preview} />
              <ActionIcon
                color="dark"
                onClick={() => {
                  setFiles([]);
                  form.setFieldValue("avatar", null);
                }}
                variant="white"
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
                notifications.show({
                  title: "Errore Upload",
                  message: "Impossibile utilizzare il file selezionato",
                  withBorder: true,
                  classNames: errorNotificationClasses,
                });
              }}
              w="100%"
            ></Upload>
          )}
        </Center>
        <SimpleGrid cols={2} mt={"md"}>
          <TextInput label="RNA" {...form.getInputProps("rna")} />
          <TextInput
            label="Numero"
            {...form.getInputProps("numero")}
          ></TextInput>

          <DateInput
            label="Data di nascita"
            {...form.getInputProps("dataNascita")}
            valueFormat="DD/MM/YYYY"
            dateParser={dateParser}
          ></DateInput>
          <Select
            {...form.getInputProps("sesso")}
            label="Sesso"
            data={[Sesso.Maschio, Sesso.Femmina, Sesso.InAttesa]}
          ></Select>

          <NumberInput
            label="Gabbia"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            {...form.getInputProps("gabbia")}
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

export default ModalSoggetto;
