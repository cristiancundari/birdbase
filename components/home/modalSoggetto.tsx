"use client";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Chip,
  Group,
  Input,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Switch,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";

import { Soggetto } from ".prisma/client";
import { dateParser } from "@/lib/DateParser";
import { Sesso } from "@/types/types";
import { DateInput } from "@mantine/dates";
import { FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
  IconCalendar,
  IconDeviceFloppy,
  IconGrave,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Upload from "../upload";

export interface FormValues {
  rna: string;
  numero: string;
  dataNascita: Date | null;
  gabbia: number | null;
  sesso: Sesso;
  avatar: string | null;
  isMorto: boolean;
}

interface PropsType {
  isOpen: boolean;
  annulla: () => void;
  submit: (values: any) => Promise<void>;
  modalData: Soggetto | null;
}

function ModalSoggetto({ isOpen, annulla, submit, modalData }: PropsType) {
  const theme = useMantineTheme();
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
      isMorto: false,
    },
    validate: {
      rna: (value) => (value.length == 0 ? "Inserire RNA" : null),
      numero: (value) =>
        value.length == 0 ? "Inserire numero anelletto" : null,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (modalData) {
        const sesso =
          modalData.sesso == true
            ? Sesso.Maschio
            : modalData.sesso == false
            ? Sesso.Femmina
            : Sesso.InAttesa;
        form.setValues({
          rna: modalData.rna,
          numero: modalData.numero,
          gabbia: modalData.gabbia,
          dataNascita: modalData.dataNascita,
          sesso: sesso,
          avatar: modalData.avatar,
          isMorto: modalData.isMorto,
        });
      } else {
        form.reset();
      }
      setFiles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalData, isOpen]);

  let preview = files.length > 0 ? URL.createObjectURL(files[0]) : null;

  if (preview == null && form.values.avatar !== null) {
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
          await submit({ form: form.values, avatarFile: files?.[0] });
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
                showNotification({
                  title: "Errore Upload",
                  message: "Impossibile utilizzare il file selezionato",
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
            leftSection={<IconCalendar size={16} />}
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
          <Group align="center">
            <Input.Wrapper label=" ">
              <Switch
                checked={form.values.isMorto}
                onChange={(event) =>
                  form.setFieldValue("isMorto", event.currentTarget.checked)
                }
                color="grape"
                label="Morto"
                thumbIcon={
                  form.values.isMorto && (
                    <IconGrave size={12} color={theme.colors.grape[6]} />
                  )
                }
              />
            </Input.Wrapper>
          </Group>
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
