"use client";
import Breadcrumb from "@/components/Breadcrumb";
import ModalCancellazione from "@/components/ModalCancellazione";
import SoggettoComp from "@/components/SoggettoComp";
import ModalSoggetto, { FormValues } from "@/components/home/ModalSoggetto";
import {
  aggiungiSoggetto,
  modificaSoggetto,
  togglePreferitoSoggetto,
} from "@/components/home/functions";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import { CovataWithGenitoriAndFigli } from "@/types/types";
import { Box, Button, Group, SimpleGrid, Text } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { Soggetto } from "@prisma/client";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InfoCovataHeader from "./infoCovataHeader";

interface InfoCovataProps {
  covata: CovataWithGenitoriAndFigli;
}

const breadcrumbsItems = [
  { title: "Covate", href: "/app/covate" },
  { title: "Info covata", href: "#" },
];

function InfoCovata({ covata }: InfoCovataProps) {
  const [isModalSoggettoOpen, setIsModalSoggettoOpen] = useState(false);
  const [modalDeleteId, setModalDeleteId] = useState("");
  const [modalData, setModalData] = useState<Soggetto | null>(null);
  const router = useRouter();

  const aggiungi = async ({
    form,
    avatarFile,
  }: {
    form: FormValues;
    avatarFile: FileWithPath;
  }) => {
    const result = await aggiungiSoggetto({
      avatarFile,
      form,
      covataId: covata.id,
    });
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "Soggetto aggiunto con successo",
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
    const result = await modificaSoggetto({
      avatarFile: avatarFile,
      form: form,
      id: modalData?.id || "",
    });
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "Soggetto modificato con successo",
        success: true,
      });
      router.refresh();
    }
  };

  const elimina = async () => {
    const result = await apiFetch.delete(`/api/soggetti/${modalDeleteId}`);
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "Soggetto eliminato con successo",
        success: true,
      });
      router.refresh();
    }
  };

  const submit = async (values: {
    form: FormValues;
    avatarFile: FileWithPath;
  }) => {
    if (modalData) {
      await modifica(values);
    } else {
      await aggiungi(values);
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

  const deleteHandler = (id: string) => {
    setModalDeleteId(id);
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

  return (
    <>
      <Breadcrumb items={breadcrumbsItems} />
      <InfoCovataHeader covata={covata} />
      <Box mt="md">
        <Box mb="md">
          <Group justify="space-between">
            <Text fw={500} fz="lg">
              Figli
            </Text>
            <Button
              onClick={addHandler}
              variant="light"
              leftSection={<IconPlus size={14} />}
            >
              Aggiungi
            </Button>
          </Group>
        </Box>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
          {covata.figli.length > 0 ? (
            covata.figli.map((soggetto) => (
              <SoggettoComp
                key={soggetto.id}
                sogg={soggetto}
                onPreferito={favouriteHandler}
                onEdit={editHandler}
                onDelete={deleteHandler}
              />
            ))
          ) : (
            <div>Ancora nessun figlio aggiunto a questa covata</div>
          )}
        </SimpleGrid>
      </Box>
      <ModalSoggetto
        isOpen={isModalSoggettoOpen}
        annulla={annullaAggiungi}
        submit={submit}
        modalData={modalData}
      />
      <ModalCancellazione
        isOpen={modalDeleteId != ""}
        titolo="Elimina Soggetto"
        onDelete={elimina}
        onClose={annullaElimina}
      />
    </>
  );
}

export default InfoCovata;
