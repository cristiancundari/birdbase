"use client";
import React, { useState } from "react";
import Gara from "./gara";
import { Box, Button, Group, SimpleGrid } from "@mantine/core";
import { ApiResponse, GaraWithNazione } from "@/types/types";
import { useSupabase } from "@/providers/supabaseProvider";
import { IconPlus } from "@tabler/icons-react";
import ModalGara, { FormValues } from "./modalGara";
import { showNotification } from "@/lib/helper";
import { useRouter } from "next/navigation";
import NessunaGara from "./nessunaGara";
import { FileWithPath } from "@mantine/dropzone";
import ModalCancellazione from "../modalCancellazione";
import { Gara as GaraType, Role } from "@prisma/client";

function GarePage({ gare }: { gare: GaraWithNazione[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<GaraType | null>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState<string | null>(null);

  const supabase = useSupabase();
  //TODO aggiustare la logica
  const isAdmin = supabase.session?.user.role != Role.ADMIN;

  function btnAggiungi() {
    setModalData(null);
    setIsOpen(true);
  }

  function annulla() {
    setIsOpen(false);
  }

  async function modifica({
    form,
    imgFile,
  }: {
    form: FormValues;
    imgFile: FileWithPath;
  }) {
    const formData = new FormData();

    formData.append("form", JSON.stringify(form));
    if (imgFile) {
      formData.append("imgFile", imgFile);
    }
    const response = await fetch(`/api/gare/${modalData?.id}`, {
      body: formData,
      method: "PATCH",
    });

    const result: ApiResponse = await response.json();

    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "Gara modificata con successo",
        success: true,
      });
      router.refresh();
    }
  }

  async function aggiungi({
    form,
    imgFile,
  }: {
    form: FormValues;
    imgFile: FileWithPath;
  }) {
    const formData = new FormData();

    formData.append("form", JSON.stringify(form));
    if (imgFile) {
      formData.append("imgFile", imgFile);
    }

    const response = await fetch("/api/gare", {
      body: formData,
      method: "POST",
    });

    const result: ApiResponse = await response.json();
    if (!result.error) {
      showNotification({
        message: "Gara aggiunta con successo",
        success: true,
      });
      router.refresh();
    } else {
      showNotification({ message: result.message });
    }
  }

  async function submit(obj: { form: FormValues; imgFile: FileWithPath }) {
    if (modalData) {
      await modifica(obj);
    } else {
      await aggiungi(obj);
    }
  }

  function onDelete(id: string) {
    setModalDeleteOpen(id);
  }

  async function eliminaGara(id: string | null) {
    const response = await fetch(`/api/gare/${id}`, {
      method: "DELETE",
    });
    const result: ApiResponse = await response.json();
    if (result.error) {
      showNotification({
        message: result.message,
      });
    } else {
      showNotification({
        message: "Gara eliminata con successo",
        success: true,
      });
      setModalDeleteOpen(null);
      router.refresh();
    }
  }

  function onEdit(gara: GaraWithNazione) {
    //settare dati modalData per mostrarli all'utente
    setModalData(gara);
    setIsOpen(true);
  }

  return (
    <>
      {isAdmin && (
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
        </Box>
      )}
      <Box>
        {gare.length == 0 && <NessunaGara isAdmin={isAdmin} />}
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
          {gare.map((gara: GaraWithNazione) => (
            <Gara
              key={gara.id}
              gara={gara}
              onDelete={onDelete}
              onEdit={onEdit}
            ></Gara>
          ))}
        </SimpleGrid>
      </Box>

      <ModalGara
        isOpen={isOpen}
        annulla={annulla}
        submit={submit}
        modalData={modalData}
      ></ModalGara>

      <ModalCancellazione
        isOpen={modalDeleteOpen != null}
        titolo="Elimina Gara"
        onDelete={async () => {
          await eliminaGara(modalDeleteOpen);
        }}
        onClose={() => setModalDeleteOpen(null)}
      ></ModalCancellazione>
    </>
  );
}

export default GarePage;
