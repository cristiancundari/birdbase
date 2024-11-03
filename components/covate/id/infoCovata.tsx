"use client";
import Breadcrumb from "@/components/Breadcrumb";
import ModalConferma from "@/components/ModalConferma";
import ModalSelezionaSoggetto from "@/components/ModalSelezionaSoggetto";
import SoggettoComp, { SoggettoMenu } from "@/components/SoggettoComp";
import ModalSoggetto, { FormValues } from "@/components/home/ModalSoggetto";
import {
  aggiungiSoggetto,
  modificaSoggetto,
  togglePreferitoSoggetto,
} from "@/components/home/functions";
import { apiFetch } from "@/lib/apiFetch";
import { formatAnelletto, showNotification } from "@/lib/helper";
import { useModalInit } from "@/lib/hooks";
import { CovataWithGenitoriAndFigli } from "@/types/types";
import {
  Box,
  Button,
  ComboboxItem,
  Group,
  Menu,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { Soggetto } from "@prisma/client";
import {
  IconCircleMinus,
  IconCirclePlus,
  IconEdit,
  IconHandClick,
  IconPlus,
} from "@tabler/icons-react";
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
  const [isModalAggiungiFiglioOpen, setIsModalAggiungiFiglioOpen] =
    useState(false);
  const [isModalAggiungiFiglioLoading, setIsModalAggiungiFiglioLoading] =
    useState(false);
  const [figliSelezionabili, setFigliSelezionabili] = useState<Soggetto[]>([]);
  const [modalRemoveId, setModalDeleteId] = useState("");
  const [modalData, setModalData] = useState<Soggetto | null>(null);
  const router = useRouter();

  useModalInit(() => {
    getSoggettiFigli();
  }, isModalAggiungiFiglioOpen);

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

  const rimuovi = async () => {
    const formData = new FormData();
    const data = { covataId: null };
    formData.append("form", JSON.stringify(data));

    const result = await apiFetch.patchFormData(
      `/api/soggetti/${modalRemoveId}`,
      formData
    );

    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "Soggetto rimosso con successo",
        success: true,
      });
      router.refresh();
    }
  };

  const getSoggettiFigli = async () => {
    setIsModalAggiungiFiglioLoading(true);
    const result = await apiFetch.get<Soggetto[]>("/api/soggetti?covataId=");
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      setFigliSelezionabili(result.data);
    }
    setIsModalAggiungiFiglioLoading(false);
  };

  const modalSoggettoSubmit = async (values: {
    form: FormValues;
    avatarFile: FileWithPath;
  }) => {
    if (modalData) {
      await modifica(values);
    } else {
      await aggiungi(values);
    }
  };

  const modalAggiungiFiglioSubmit = async (soggetto: Soggetto) => {
    const data = {
      covataId: covata.id,
    };
    const formData = new FormData();
    formData.append("form", JSON.stringify(data));

    const result = await apiFetch.patchFormData(
      `/api/soggetti/${soggetto.id}`,
      formData
    );

    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "Figlio aggiunto correttamente alla covata",
        success: true,
      });
      router.refresh();
    }
  };

  const annullaAggiungi = () => {
    setIsModalSoggettoOpen(false);
  };

  const annullaRimuovi = () => {
    setModalDeleteId("");
  };

  const annullaAggiungiFiglio = () => {
    setIsModalAggiungiFiglioOpen(false);
  };

  const addNewHandler = () => {
    setModalData(null);
    setIsModalSoggettoOpen(true);
  };

  const addExistingHandler = () => {
    setIsModalAggiungiFiglioOpen(true);
  };

  const editHandler = (soggetto: Soggetto) => {
    setModalData(soggetto);
    setIsModalSoggettoOpen(true);
  };

  const removeHandler = (soggetto: Soggetto) => {
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

  const menuSoggetto: SoggettoMenu[] = [
    { label: "Modifica", fn: editHandler, icon: <IconEdit size={14} /> },
    {
      label: "Rimuovi",
      fn: removeHandler,
      icon: <IconCircleMinus size={14} />,
    },
  ];

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
            <Menu shadow="md">
              <Menu.Target>
                <Button
                  disabled={covata.uovaDeposte <= covata.figli.length}
                  variant="light"
                  leftSection={<IconPlus size={14} />}
                  data-testid="button-aggiungi-figlio"
                >
                  Aggiungi
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconCirclePlus size={14} />}
                  onClick={addNewHandler}
                >
                  Crea nuovo
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconHandClick size={14} />}
                  onClick={addExistingHandler}
                >
                  Seleziona esistente
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Box>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
          {covata.figli.length > 0 ? (
            covata.figli.map((soggetto) => (
              <SoggettoComp
                key={soggetto.id}
                sogg={soggetto}
                onPreferito={favouriteHandler}
                menu={menuSoggetto}
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
        submit={modalSoggettoSubmit}
        modalData={modalData}
      />
      <ModalSelezionaSoggetto
        soggetti={figliSelezionabili}
        isLoading={isModalAggiungiFiglioLoading}
        isOpen={isModalAggiungiFiglioOpen}
        annulla={annullaAggiungiFiglio}
        submit={modalAggiungiFiglioSubmit}
        description="Sono visualizzati solo i soggetti figli di nessuna covata"
      />
      <ModalConferma
        isOpen={modalRemoveId != ""}
        titolo="Rimuovi Soggetto"
        confirmButton={{
          label: "Rimuovi",
          icon: <IconCircleMinus size={14} />,
          color: "yellow",
        }}
        onConfirm={rimuovi}
        onClose={annullaRimuovi}
      >
        <Stack gap="xs" align="center">
          <Text size="sm">
            {"Vuoi rimuovere questo soggetto dalla covata?"}
          </Text>
        </Stack>
      </ModalConferma>
    </>
  );
}

export default InfoCovata;
