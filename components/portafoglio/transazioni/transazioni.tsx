"use client";
import { showNotification } from "@/lib/helper";
import { ApiResponse, TransazioneWithCategoria } from "@/types/types";
import {
  Box,
  Button,
  Group,
  Paper,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import ModalTransazione, { FormValues } from "./modalTransazione";
import TransazioneComp, { TransazioneCompSkeleton } from "./transazioneComp";
import ModalCancellazione from "../../modalCancellazione";
import { usePortafoglioContext } from "../portafoglioPage";

function Transazioni() {
  const { state: forceRender, setState: setForceRender } =
    usePortafoglioContext();
  const isMobile = useMediaQuery(`(max-width: 62em)`);
  const [isOpen, setIsOpen] = useState(false);
  const [editTransazione, setEditTransazione] =
    useState<TransazioneWithCategoria | null>(null);
  const [isModalCancellazioneOpen, setIsModalCancellazioneOpen] = useState("");
  const [transazioni, setTransazioni] = useState<TransazioneWithCategoria[]>(
    []
  );
  const [isTransazioniLoading, setIsTransazioniLoading] = useState(true);

  function openModalAggiungi() {
    setEditTransazione(null);
    setIsOpen(true);
  }

  function annulla() {
    setIsOpen(false);
  }

  function openModalElimina(transazione: TransazioneWithCategoria) {
    setIsModalCancellazioneOpen(transazione.id.toString());
  }

  async function elimina() {
    const response = await fetch(
      `/api/transazioni/${isModalCancellazioneOpen}`,
      {
        method: "DELETE",
      }
    );
    const result: ApiResponse = await response.json();
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "Transazione eliminat correttamente",
        success: true,
      });
      getTransazioni();
      setForceRender(forceRender + 1);
    }
  }

  function openModalModifica(transazione: TransazioneWithCategoria) {
    setEditTransazione(transazione);
    setIsOpen(true);
  }

  const getTransazioni = async () => {
    const response = await fetch("/api/transazioni");
    const result: ApiResponse = await response.json();
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      setTransazioni(result.result);
    }
  };

  useEffect(() => {
    async function _getTransazioni() {
      setIsTransazioniLoading(true);
      await getTransazioni();
      setIsTransazioniLoading(false);
    }
    _getTransazioni();
  }, []);

  async function aggiungi(values: FormValues) {
    const response = await fetch("/api/transazioni", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const result: ApiResponse = await response.json();

    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "La Transazione è stata inserita correttamente",
        success: true,
      });
      getTransazioni();
      setForceRender(forceRender + 1);
    }
  }

  async function modifica(values: FormValues) {
    const response = await fetch(`/api/transazioni/${editTransazione?.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const result: ApiResponse = await response.json();

    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "La Transazione è stata modificata correttamente",
        success: true,
      });
      getTransazioni();
      setForceRender(forceRender + 1);
    }
  }

  async function submit(values: FormValues) {
    if (editTransazione == null) {
      await aggiungi(values);
    } else {
      await modifica(values);
    }
  }

  return (
    <>
      <Paper
        p="md"
        shadow="xs"
        style={{
          flexGrow: 1,
          minHeight: isMobile
            ? "calc(100vh - var(--app-shell-header-height) - var(--mantine-spacing-md)*2)"
            : "auto",
        }}
      >
        <Stack gap="xs" h="100%">
          <Group justify="space-between">
            <Text fw={500} fz="lg">
              Transazioni
            </Text>
            <Button
              onClick={openModalAggiungi}
              variant="light"
              leftSection={<IconPlus size={14} />}
            >
              Aggiungi
            </Button>
          </Group>

          <Box pos="relative" w="100%" h="100%">
            <ScrollArea
              pos="absolute"
              left={0}
              right={0}
              h="100%"
              mx="-md"
              px="md"
            >
              {isTransazioniLoading
                ? Array(4)
                    .fill(0)
                    .map((_, index) => <TransazioneCompSkeleton key={index} />)
                : transazioni.map((item, index) => (
                    <TransazioneComp
                      transazione={item}
                      key={item.id}
                      printLabel={item.data != transazioni[index - 1]?.data}
                      elimina={openModalElimina}
                      modifica={openModalModifica}
                    />
                  ))}
            </ScrollArea>
          </Box>
        </Stack>
      </Paper>

      <ModalTransazione
        isOpen={isOpen}
        annulla={annulla}
        submit={submit}
        transazione={editTransazione}
      />
      <ModalCancellazione
        isOpen={isModalCancellazioneOpen != ""}
        titolo="Elimina Transazione"
        onClose={() => setIsModalCancellazioneOpen("")}
        onDelete={elimina}
      />
    </>
  );
}

export default Transazioni;
