"use client";
import ModalCancellazione from "@/components/ModalCancellazione";
import GaraCard from "@/components/gare/GaraCard";
import ModalGara, { FormValues } from "@/components/gare/ModalGara";
import NessunaGara from "@/components/gare/NessunaGara";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import { useSupabase } from "@/providers/supabaseProvider";
import { ApiResponse, GaraWithNazioneAndCountIscrizioni } from "@/types/types";
import { Box, Button, Group, SimpleGrid, Skeleton } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { Gara as GaraType, Role } from "@prisma/client";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface FormData {
  form: FormValues;
  imgFile: FileWithPath;
}

function GarePage() {
  const supabase = useSupabase();

  const [gare, setGare] = useState<GaraWithNazioneAndCountIscrizioni[]>([]);
  const [isGareLoading, setIsGareLoading] = useState(true);

  const [isModalGaraOpen, setIsModalGaraOpen] = useState(false);
  const [modalData, setModalData] = useState<GaraType | null>(null);

  const [modalDeleteId, setModalDeleteId] = useState<string>("");

  const aggiungi = async ({ form, imgFile }: FormData) => {
    const formData = new FormData();

    formData.append("form", JSON.stringify(form));
    if (imgFile) {
      formData.append("imgFile", imgFile);
    }

    const result = await apiFetch.postFormData("/api/gare", formData);

    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "Gara aggiunta con successo",
        success: true,
      });
      getGare();
    }
  };

  const modifica = async ({ form, imgFile }: FormData) => {
    const formData = new FormData();

    formData.append("form", JSON.stringify(form));
    if (imgFile) {
      formData.append("imgFile", imgFile);
    }
    const result = await apiFetch.patchFormData(
      `/api/gare/${modalData?.id}`,
      formData
    );

    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "Gara modificata con successo",
        success: true,
      });
      getGare();
    }
  };

  const elimina = async () => {
    const result = await apiFetch.delete<GaraType>(
      `/api/gare/${modalDeleteId}`
    );
    if (result.error) {
      showNotification({
        message: result.message,
      });
    } else {
      showNotification({
        message: "Gara eliminata con successo",
        success: true,
      });
      getGare();
    }
    setModalDeleteId("");
  };

  const submit = async (values: FormData) => {
    if (modalData) {
      await modifica(values);
    } else {
      await aggiungi(values);
    }
  };

  const annullaAggiungi = () => {
    setIsModalGaraOpen(false);
  };

  const annullaElimina = () => {
    setModalDeleteId("");
  };

  const addHandler = () => {
    setModalData(null);
    setIsModalGaraOpen(true);
  };

  const editHandler = (gara: GaraWithNazioneAndCountIscrizioni) => {
    setModalData(gara);
    setIsModalGaraOpen(true);
  };

  const deleteHandler = (id: string) => {
    setModalDeleteId(id);
  };

  const getGare = async () => {
    const result = await apiFetch.get<GaraWithNazioneAndCountIscrizioni[]>(
      "/api/gare"
    );
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      setGare(result.data);
    }
  };

  useEffect(() => {
    const _getGare = async () => {
      setIsGareLoading(true);
      await getGare();
      setIsGareLoading(false);
    };
    _getGare();
  }, []);

  return (
    <>
      {supabase.user?.ruolo === Role.ADMIN && (
        <Box mb="md">
          <Group justify={"flex-end"}>
            <Button
              onClick={addHandler}
              variant="light"
              leftSection={<IconPlus size={14} />}
            >
              Aggiungi
            </Button>
          </Group>
        </Box>
      )}
      <Box>
        {isGareLoading == false && gare.length == 0 && <NessunaGara />}
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
          {isGareLoading &&
            Array(6)
              .fill(0)
              .map((_, i) => <Skeleton key={i} h={300} />)}
          {gare.map((gara: GaraWithNazioneAndCountIscrizioni) => (
            <GaraCard
              key={gara.id}
              gara={gara}
              onDelete={deleteHandler}
              onEdit={editHandler}
            />
          ))}
        </SimpleGrid>
      </Box>

      <ModalGara
        isOpen={isModalGaraOpen}
        modalData={modalData}
        submit={submit}
        annulla={annullaAggiungi}
      />

      <ModalCancellazione
        isOpen={modalDeleteId != ""}
        titolo="Elimina Gara"
        onDelete={elimina}
        onClose={annullaElimina}
      />
    </>
  );
}

export default GarePage;
