"use client";
import { showNotification } from "@/lib/helper";
import { createClient } from "@/lib/supabase/client";
import { ApiResponse, Sesso } from "@/types/types";
import {
  Box,
  Button,
  Group,
  ScrollArea,
  SimpleGrid
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { Soggetto } from "@prisma/client";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ModalCancellazione from "../modalCancellazione";
import SoggettoComp from "../soggetto";
import ModalSoggetto, { FormValues } from "./modalSoggetto";
import NessunSoggetto from "./nessunSoggetto";

function Homepage({ soggetti }: { soggetti: Soggetto[] }) {
  const supabase = createClient();
  const [modalDeleteOpen, setModalDeleteOpen] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [modalData, setModalData] = useState<Soggetto | null>(null);
  const router = useRouter();

  //Aggiunta Soggetto
  const btnAggiungi = () => {
    setModalData(null);
    setModalOpen(true);
  };

  const aggiungi = async ({
    form,
    avatarFile,
  }: {
    form: FormValues;
    avatarFile: FileWithPath;
  }) => {
    let sesso = null;
    if (form.sesso == Sesso.Maschio) {
      sesso = true;
    } else if (form.sesso == Sesso.Femmina) {
      sesso = false;
    }
    const formData = new FormData();

    formData.append("form", JSON.stringify({ ...form, sesso: sesso }));
    if (avatarFile) {
      formData.append("imgFile", avatarFile);
    }

    const result = await fetch("/api/soggetti", {
      method: "POST",
      body: formData,
    });
    const res: ApiResponse = await result.json();
    if (res.error) {
      showNotification({ message: res.message });
    } else {
      showNotification({
        message: "Il soggetto è stato inserito correttamente",
        success: true,
      });
      router.refresh();
    }
  };

  const modifica = async ({
    form,
    avatarFile,
  }: {
    form: FormValues;
    avatarFile: FileWithPath;
  }) => {
    let sesso = null;
    if (form.sesso == Sesso.Maschio) {
      sesso = true;
    } else if (form.sesso == Sesso.Femmina) {
      sesso = false;
    }
    const id = modalData?.id;

    const values = new FormData();
    values.append("form", JSON.stringify({ ...form, sesso: sesso }));
    if (avatarFile) {
      values.append("imgFile", avatarFile);
    }
    const response = await fetch(`/api/soggetti/${id}`, {
      method: "PATCH",
      body: values,
    });
    const result: ApiResponse = await response.json();
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "Soggetto modificato correttamente",
        success: true,
      });
      router.refresh();
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
    if (id == "") {
      return null;
    }
    const result = await fetch(`/api/soggetti/${id}`, {
      method: "DELETE",
    });
    if (result.ok) {
      router.refresh();
    } else {
      const res = await result.json();
      showNotification({
        message: res.result,
      });
    }
  };

  const deleteHandler = (id: string) => {
    setModalDeleteOpen(id);
  };

  const handlerPreferito = async (id: string) => {
    const response = await fetch(`/api/soggetti/${id}`, {
      method: "PUT",
    });
    const result: ApiResponse = await response.json();
    if (result.error) {
      showNotification({ message: result.message });
      return null;
    } else {
      return result.result;
    }
  };

  return (
    <>
      <Box mb="md">
        <Group justify={"flex-end"}>
          <Button
            onClick={btnAggiungi}
            variant="light"
            leftSection={<IconPlus size={14} />}
          >
            Aggiungi
          </Button>
        </Group>
        <Box>
          {soggetti.length == 0 && <NessunSoggetto />}
          <ScrollArea>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }}>
              {soggetti.map((soggetto) => (
                <SoggettoComp
                  key={soggetto.id}
                  sogg={soggetto}
                  onEdit={editHandler}
                  onDelete={deleteHandler}
                  handlerPreferito={handlerPreferito}
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

      <ModalCancellazione
        isOpen={modalDeleteOpen != null}
        titolo="Elimina Soggetto"
        onDelete={async () => {
          await deleteSogg(modalDeleteOpen || "");
          setModalDeleteOpen(null);
        }}
        onClose={() => setModalDeleteOpen(null)}
      ></ModalCancellazione>
    </>
  );
}

export default Homepage;
