"use client";
import { InserzioneWithSoggettoAndAllevatoreAndRisultatiGare } from "@/types/types";
import { Box, Button, Card, Group, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import ModalInserzione, { FormValues } from "./ModalInserzione";
import { useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { initialOptions, showNotification } from "@/lib/helper";
import InserzioneItem from "./InserzioneItem";
import { useRouter } from "next/navigation";
import ModalCancellazione from "../ModalCancellazione";
import { Inserzione } from "@prisma/client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
function Marketplace({
  inserzioni,
}: {
  inserzioni: InserzioneWithSoggettoAndAllevatoreAndRisultatiGare[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalDeleteId, setModalDeleteId] = useState<number | null>(null);
  const [modalData, setModalData] = useState<Inserzione | null>(null);
  const router = useRouter();

  const onClose = () => setIsOpen(false);
  const btnAggiungiInserzione = () => {
    setModalData(null);
    setIsOpen(true);
  };

  const queryAggiungi = async (data: FormValues) => {
    const result = await apiFetch.post("/api/inserzioni", {
      data,
    });
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "Inserzione aggiunta correttamente!",
        success: true,
      });
      router.refresh();
    }
  };

  const queryModifica = async (data: FormValues) => {
    const result = await apiFetch.patch(
      `/api/inserzioni/${modalData?.id}`,
      data
    );
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "Inserzione modificata correttamente!",
        success: true,
      });
      router.refresh();
    }
  };

  const annullaElimina = () => setModalDeleteId(null);

  const elimina = async () => {
    const result = await apiFetch.delete(`/api/inserzioni/${modalDeleteId}`);
    if (result.error) {
      showNotification({
        message: result.message,
      });
    } else {
      showNotification({
        message: "Inserzione eliminata con successo",
        success: true,
      });
    }
    setModalDeleteId(null);
    router.refresh();
  };

  const deleteHandler = (id: number) => setModalDeleteId(id);

  const editHandler = (
    inserzione: InserzioneWithSoggettoAndAllevatoreAndRisultatiGare
  ) => {
    setModalData(inserzione);
    setIsOpen(true);
  };

  const onConfirm = async (data: FormValues) => {
    if (modalData === null) {
      await queryAggiungi(data);
    } else {
      await queryModifica(data);
    }
  };

  return (
    <>
      <Box mb="md">
        <Group justify={"flex-end"}>
          <Button
            data-testid="ButtonAggiungi"
            onClick={btnAggiungiInserzione}
            variant="light"
            leftSection={<IconPlus size={14} />}
          >
            Aggiungi
          </Button>
        </Group>
        <Box m="md">
          <PayPalScriptProvider options={initialOptions}>
            {inserzioni.length === 0 ? (
              <Text>Nessuna inserzione</Text>
            ) : (
              inserzioni.map((inserzione) => (
                <Card shadow="xs" key={inserzione.id} my="xs">
                  <InserzioneItem
                    inserzione={inserzione}
                    onEdit={editHandler}
                    onDelete={deleteHandler}
                  />
                </Card>
              ))
            )}
          </PayPalScriptProvider>
        </Box>
      </Box>

      <ModalInserzione
        onConfirm={onConfirm}
        isOpen={isOpen}
        onClose={onClose}
        modalData={modalData}
      />

      <ModalCancellazione
        isOpen={modalDeleteId != null}
        titolo="Elimina Inserzione"
        onDelete={elimina}
        onClose={annullaElimina}
      />
    </>
  );
}

export default Marketplace;
