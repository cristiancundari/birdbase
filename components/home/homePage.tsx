"use client";
import {
  Container,
  Button,
  Center,
  Group,
  SimpleGrid,
  ScrollArea,
  Text,
  Box,
  Modal,
  Stack,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SoggettoComp from "../soggetto";
import { Soggetto } from "@prisma/client";
import { IconDeviceFloppy, IconPlus, IconX } from "@tabler/icons-react";
import errorNotificationClasses from "@/styles/errorNotification.module.css";
import ModalSoggetto from "./modalSoggetto";
import { Sesso } from "@/types/types";
import { ModalsProvider, modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";
import NessunSoggetto from "./nessunSoggetto";
import { FileWithPath } from "@mantine/dropzone";
import { v4 as uuidv4 } from "uuid";
import { useSetState } from "@mantine/hooks";
import { createClient } from "@/lib/supabase/client";

function Homepage({ soggetti }: { soggetti: Soggetto[] }) {
  const supabase = createClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDelete, setModalDelete] = useSetState({
    loading: false,
    open: false,
    id: "",
  });

  const [modalData, setModalData] = useState<Soggetto | null>(null);
  const router = useRouter();

  //Aggiunta Soggetto
  const btnAggiungi = () => {
    setModalData(null);
    setModalOpen(true);
  };

  const aggiungi = async (values: any) => {
    const avatar: FileWithPath = values.avatarFile;
    let imgName = null;
    if (avatar) {
      imgName = uuidv4();
      const upload = await supabase.storage.from("img").upload(imgName, avatar);
      if (upload.error) {
        notifications.show({
          title: "Errore Upload",
          message: upload.error.message,
          withBorder: true,
          classNames: errorNotificationClasses,
        });
        return null;
      }
    }
    const result = await fetch("/api/soggetto", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        ...values,
        avatar: imgName,
      }),
    });
    setModalOpen(false);
    if (result.ok) {
      router.refresh();
    } else {
      const res = await result.json();
      notifications.show({
        title: "Errore",
        message: res.result,
        withBorder: true,
        classNames: errorNotificationClasses,
      });
    }
  };

  const modifica = async (values: any) => {
    console.log("modifica", values);
    if (values.sesso == Sesso.Maschio) {
      values.sesso = true;
    } else if (values.sesso == Sesso.Femmina) {
      values.sesso = false;
    } else {
      values.sesso = null;
    }
    values.id = modalData?.id;

    // Se il soggetto ha già un avatar e non è stato sovrascritto dall'utente impostiamo undefined così che Prisma non alteri il campo sul DB. Altrimenti lo impostiamo a null
    let imgName: any = values.avatar ? undefined : null;

    const avatar: FileWithPath = values.avatarFile;
    if (avatar) {
      imgName = uuidv4();
      const upload = await supabase.storage.from("img").upload(imgName, avatar);

      if (upload.error) {
        notifications.show({
          title: "Errore Upload",
          message: upload.error.message,
          withBorder: true,
          classNames: errorNotificationClasses,
        });
        return null;
      }
    }

    const result = await fetch("/api/soggetto", {
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
      body: JSON.stringify({ ...values, avatar: imgName }),
    });
    if (result.ok) {
      router.refresh();
    } else {
      const res = await result.json();
      notifications.show({
        title: "Errore",
        message: res.result,
        withBorder: true,
        classNames: errorNotificationClasses,
      });
    }
  };

  const submit = async (values: any) => {
    if (modalData == null) {
      await aggiungi(values);
    } else {
      await modifica(values);
    }
  };

  const annulla = () => {
    setModalOpen(false);
  };

  const editHandler = (soggetto: Soggetto) => {
    setModalData(soggetto);
    setModalOpen(true);
  };

  const deleteSogg = async (id: string) => {
    const result = await fetch("/api/soggetto", {
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    if (result.ok) {
      router.refresh();
    } else {
      const res = await result.json();
      notifications.show({
        title: "Errore",
        message: res.result,
        withBorder: true,
        classNames: errorNotificationClasses,
      });
    }
  };

  const deleteHandler = (id: string) => {
    setModalDelete({ id: id, open: true });
  };

  return (
    <>
      <Box>
        <Group justify={"flex-end"}>
          <Button
            onClick={btnAggiungi}
            variant="light"
            leftSection={<IconPlus size={14} />}
          >
            Aggiungi
          </Button>
        </Group>
        <Box mt="md">
          {soggetti.length == 0 && <NessunSoggetto />}
          <ScrollArea>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }}>
              {soggetti.map((soggetto) => (
                <SoggettoComp
                  key={soggetto.id}
                  sogg={soggetto}
                  onEdit={editHandler}
                  onDelete={deleteHandler}
                />
              ))}
            </SimpleGrid>
          </ScrollArea>
        </Box>

        <ModalSoggetto
          isOpen={modalOpen}
          annulla={annulla}
          submit={submit}
          modalData={modalData}
        />
      </Box>

      <Modal
        opened={modalDelete.open}
        onClose={() => {
          setModalDelete({ open: false });
        }}
        title={"Elimina Soggetto"}
      >
        <Stack gap="xs" align="center">
          <Text size="sm">Sei sicuro di voler eliminare il soggetto?</Text>
          <Text size="sm">Questa azione non potrà essere annullata.</Text>
        </Stack>

        <Group mt={"lg"} gap="md" justify="flex-end">
          <Button
            variant="outline"
            color="gray"
            onClick={() => {
              setModalDelete({ open: false });
            }}
            leftSection={<IconX size={14} />}
          >
            Annulla
          </Button>
          <Button
            color="red"
            leftSection={<IconTrash size={14} />}
            loading={modalDelete.loading}
            onClick={async () => {
              setModalDelete({ loading: true });
              await deleteSogg(modalDelete.id);
              setModalDelete({ loading: false, open: false });
            }}
          >
            Elimina
          </Button>
        </Group>
      </Modal>
    </>
  );
}

export default Homepage;
