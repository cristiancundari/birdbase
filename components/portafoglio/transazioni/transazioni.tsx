"use client";
import { formatData, showNotification } from "@/lib/helper";
import { ApiResponse, TransazioneWithCategoria } from "@/types/types";
import {
  Box,
  Button,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import ModalTransazione, { FormValues } from "./modalTransazione";
import TransazioneComp, { TransazioneCompSkeleton } from "./transazioneComp";
import ModalCancellazione from "../../ModalCancellazione";
import { usePortafoglioContext } from "../portafoglioPage";
import { apiFetch } from "@/lib/apiFetch";

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
    const result = await apiFetch.delete(
      `/api/transazioni/${isModalCancellazioneOpen}`
    );
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "Transazione eliminata correttamente",
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
    const result = await apiFetch.get("/api/transazioni");
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      setTransazioni(result.data);
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
    const result = await apiFetch.post("/api/transazioni", values);

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
    const result = await apiFetch.patch(
      `/api/transazioni/${editTransazione?.id}`,
      values
    );

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
              data-testid="ButtonAggiungi"
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
                      printLabel={
                        formatData(item.data) !=
                        formatData(transazioni[index - 1]?.data)
                      }
                      elimina={openModalElimina}
                      modifica={openModalModifica}
                    />
                  ))}
            </ScrollArea>
          </Box>
        </Stack>
      </Paper>

      <ModalTransazione
        data-testid="ModalTransazione"
        isOpen={isOpen}
        annulla={annulla}
        submit={submit}
        transazione={editTransazione}
      />
      <ModalCancellazione
        data-testid="ModalCancellazione"
        isOpen={isModalCancellazioneOpen != ""}
        titolo="Elimina Transazione"
        onClose={() => setIsModalCancellazioneOpen("")}
        onDelete={elimina}
      />
    </>
  );
}

export default Transazioni;
