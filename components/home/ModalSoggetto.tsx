"use client";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Group,
  Input,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Switch,
  TextInput,
  Fieldset,
  useMantineTheme,
  Textarea,
  Stack,
} from "@mantine/core";

import { dateParser } from "@/lib/DateParser";
import { getBucketImgPath } from "@/lib/helper";
import { Sesso } from "@/types/types";
import { DateInput } from "@mantine/dates";
import { FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { Soggetto } from "@prisma/client";
import {
  IconCalendar,
  IconDeviceFloppy,
  IconGrave,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Upload from "../Upload";

export interface FormValues {
  rna: string;
  numero: string;
  anno: string;
  dataNascita: Date | null;
  gabbia: number | null;
  sesso: Sesso;
  avatar: string | null;
  isMorto: boolean;
  note: string;
}

interface PropsType {
  isOpen: boolean;
  annulla: () => void;
  submit: (values: any) => Promise<void>;
  modalData: Soggetto | null;
}

function ModalSoggetto({
  isOpen,
  annulla,
  submit,
  modalData,
  ...others
}: PropsType) {
  const theme = useMantineTheme();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const form = useForm<FormValues>({
    validateInputOnBlur: true,
    initialValues: {
      rna: "",
      numero: "",
      anno: "",
      dataNascita: new Date(),
      gabbia: null,
      sesso: Sesso.InAttesa,
      avatar: null,
      isMorto: false,
      note: "",
    },
    validate: {
      rna: (value) => (value.length == 0 ? "Inserire RNA" : null),
      numero: (value) =>
        value.length == 0 ? "Inserire numero anelletto" : null,
      anno: (value) => (value.length == 0 ? "Inserire anno anelletto" : null),
    },
  });

  const removeImageHandler = () => {
    setFiles([]);
    form.setFieldValue("avatar", null);
  };

  const onUploadReject = () => {
    showNotification({
      title: "Errore Upload",
      message: "Impossibile utilizzare il file selezionato",
    });
  };

  const onFormSubmit = form.onSubmit(async () => {
    setIsSubmitLoading(true);
    await submit({ form: form.values, avatarFile: files?.[0] });
    setIsSubmitLoading(false);
    annulla();
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
          anno: modalData.anno,
          gabbia: modalData.gabbia,
          dataNascita: modalData.dataNascita,
          sesso: sesso,
          avatar: modalData.avatar,
          isMorto: modalData.isMorto,
          note: modalData.note,
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
    preview = getBucketImgPath("img", form.values.avatar);
  }

  return (
    <Modal
      {...others}
      opened={isOpen}
      onClose={annulla}
      title={modalData == null ? "Aggiungi Soggetto" : "Modifica Soggetto"}
      centered
    >
      <form onSubmit={onFormSubmit}>
        <Stack>
          <Center>
            {preview ? (
              <Box pos="relative">
                <Avatar variant="filled" size="xl" src={preview} />
                <ActionIcon
                  color="dark"
                  onClick={removeImageHandler}
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
                onReject={onUploadReject}
                w="100%"
              ></Upload>
            )}
          </Center>

          <Fieldset legend="Anelletto">
            <SimpleGrid cols={3}>
              <TextInput label="RNA" {...form.getInputProps("rna")} />
              <TextInput label="Anno" {...form.getInputProps("anno")} />
              <TextInput label="Numero" {...form.getInputProps("numero")} />
            </SimpleGrid>
          </Fieldset>
          <Fieldset legend="Info">
            <SimpleGrid cols={2}>
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
                    label="Morto"
                    color="grape"
                    thumbIcon={
                      form.values.isMorto && (
                        <IconGrave size={12} color={theme.colors.grape[6]} />
                      )
                    }
                    {...form.getInputProps("isMorto", { type: "checkbox" })}
                  />
                </Input.Wrapper>
              </Group>
            </SimpleGrid>
          </Fieldset>

          <Textarea
            label="Note"
            placeholder="Inserisci una nota"
            {...form.getInputProps("note")}
          />
        </Stack>

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
            data-testid="ButtonSalva"
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

export default ModalSoggetto;
