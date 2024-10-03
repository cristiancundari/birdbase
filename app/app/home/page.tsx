"use client";
import SoggettoComp, { SoggettoMenu } from "@/components/SoggettoComp";
import {
  aggiungiSoggetto,
  modificaSoggetto,
  togglePreferitoSoggetto,
} from "@/components/home/functions";
import ModalSoggetto, { FormValues } from "@/components/home/ModalSoggetto";
import NessunSoggetto from "@/components/home/NessunSoggetto";
import ModalCancellazione from "@/components/ModalCancellazione";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import { Box, Button, Group, SimpleGrid, Skeleton } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { Soggetto } from "@prisma/client";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface FormData {
  form: FormValues;
  avatarFile: FileWithPath;
}

function HomePage() {
  const [soggetti, setSoggetti] = useState<Soggetto[]>([]);
  const [isSoggettiLoading, setIsSoggettiLoading] = useState(true);

  const [isModalSoggettoOpen, setIsModalSoggettoOpen] = useState(false);
  const [modalData, setModalData] = useState<Soggetto | null>(null);

  const [modalDeleteId, setModalDeleteId] = useState<string>("");

  const aggiungi = async ({ form, avatarFile }: FormData) => {
    const res = await aggiungiSoggetto({ form, avatarFile });
    if (res.error) {
      showNotification({ message: res.message });
    } else {
      showNotification({
        message: "Soggetto aggiunto con successo",
        success: true,
      });
      getSoggetti();
    }
  };

  const modifica = async ({ form, avatarFile }: FormData) => {
    const id = modalData?.id || "";
    const res = await modificaSoggetto({ form, avatarFile, id });
    if (res.error) {
      showNotification({ message: res.message });
    } else {
      showNotification({
        message: "Soggetto modificato con successo",
        success: true,
      });
      getSoggetti();
    }
  };

  const elimina = async () => {
    const res = await apiFetch.delete<Soggetto>(
      `/api/soggetti/${modalDeleteId}`
    );
    if (res.error) {
      showNotification({
        message: res.message,
      });
    } else {
      showNotification({
        message: "Soggetto eliminato con successo",
        success: true,
      });
      getSoggetti();
    }
    setModalDeleteId("");
  };

  const submit = async (values: FormData) => {
    if (modalData == null) {
      await aggiungi(values);
    } else {
      await modifica(values);
    }
  };

  const annullaAggiungi = () => {
    setIsModalSoggettoOpen(false);
  };

  const annullaElimina = () => {
    setModalDeleteId("");
  };

  const addHandler = () => {
    setModalData(null);
    setIsModalSoggettoOpen(true);
  };

  const editHandler = (soggetto: Soggetto) => {
    setModalData(soggetto);
    setIsModalSoggettoOpen(true);
  };

  const deleteHandler = (soggetto: Soggetto) => {
    setModalDeleteId(soggetto.id);
  };

  const favouriteHandler = async (id: string) => {
    const result = await togglePreferitoSoggetto(id);
    if (result.error) {
      showNotification({ message: result.message });
      return null;
    } else {
      return result.data;
    }
  };

  const getSoggetti = async () => {
    const result = await apiFetch.get<Soggetto[]>("/api/soggetti");
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      setSoggetti(result.data);
    }
  };

  useEffect(() => {
    const _getSoggetti = async () => {
      setIsSoggettiLoading(true);
      await getSoggetti();
      setIsSoggettiLoading(false);
    };
    _getSoggetti();
  }, []);

  const menuSoggetto: SoggettoMenu[] = [
    { label: "Modifica", fn: editHandler, icon: <IconEdit size={14} /> },
    {
      label: "Elimina",
      fn: deleteHandler,
      icon: <IconTrash size={14} />,
      color: "red",
    },
  ];

  return (
    <>
      <Box mb="md">
        <Group justify={"flex-end"}>
          <Button
            data-testid="ButtonAggiungi"
            onClick={addHandler}
            variant="light"
            leftSection={<IconPlus size={14} />}
          >
            Aggiungi
          </Button>
        </Group>
      </Box>
      <Box>
        {isSoggettiLoading == false && soggetti.length == 0 && (
          <NessunSoggetto />
        )}
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3, xl: 4 }}>
          {isSoggettiLoading &&
            Array(6)
              .fill(0)
              .map((_, i) => <Skeleton key={i} h={140} />)}
          {soggetti.map((soggetto) => (
            <SoggettoComp
              key={soggetto.id}
              sogg={soggetto}
              menu={menuSoggetto}
              onPreferito={favouriteHandler}
            />
          ))}
        </SimpleGrid>
      </Box>

      <ModalSoggetto
        data-testid="ModalSoggetto"
        isOpen={isModalSoggettoOpen}
        modalData={modalData}
        submit={submit}
        annulla={annullaAggiungi}
      />

      <ModalCancellazione
        data-testid="ModalCancellazione"
        isOpen={modalDeleteId != ""}
        titolo="Elimina Soggetto"
        onDelete={elimina}
        onClose={annullaElimina}
      />
    </>
  );
}

export default HomePage;
