"use client";
import React, { useEffect, useState } from "react";
import CovataComp from "./covataComp";
import { Box, Button, Group, SimpleGrid, Skeleton } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import ModalCovata, { CovataFormValues } from "./modalCovata";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import { CovataWithGenitori } from "@/types/types";
import ModalCancellazione from "../ModalCancellazione";

function CovatePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<CovataWithGenitori | null>(null);
  const [covate, setCovate] = useState<CovataWithGenitori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState<number | null>(null);

  useEffect(() => {
    const _getCovate = async () => {
      setIsLoading(true);
      await getCovate();
      setIsLoading(false);
    };
    _getCovate();
  }, []);

  async function getCovate() {
    const result = await apiFetch.get<CovataWithGenitori[]>("/api/covate");
    if (result.error) {
      showNotification({ message: "Errore nel caricamento delle covate" });
    } else {
      setCovate(result.data);
    }
  }
  async function aggiungi(values: CovataFormValues) {
    const result = await apiFetch.post("/api/covate", values);
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "La covata è stata aggiunta correttamente",
        success: true,
      });
      getCovate();
    }
  }
  async function modifica(values: CovataFormValues) {
    const result = await apiFetch.patch(`/api/covate/${modalData?.id}`, values);
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "La covata è stata modificata correttamente",
        success: true,
      });
      getCovate();
    }
  }
  async function elimina() {
    if (isDeleteOpen) {
      const result = await apiFetch.delete(`/api/covate/${isDeleteOpen}`);
      if (result.error) {
        showNotification({ message: result.message });
      } else {
        showNotification({
          message: "Covata eliminata correttamente.",
          success: true,
        });
        getCovate();
      }
    }
  }

  async function submit(values: CovataFormValues) {
    if (modalData == null) {
      await aggiungi(values);
    } else {
      await modifica(values);
    }
  }

  function annulla() {
    setIsOpen(false);
  }

  function btnAggiungiCovata() {
    setModalData(null);
    setIsOpen(true);
  }

  function modalModifica(covata: CovataWithGenitori) {
    setModalData(covata);
    setIsOpen(true);
  }
  function modalElimina(id: number) {
    setIsDeleteOpen(id);
  }
  function annullaModalCancellazione() {
    setIsDeleteOpen(null);
  }

  return (
    <>
      <Box mb="md">
        <Group justify={"flex-end"}>
          <Button
            onClick={btnAggiungiCovata}
            variant="light"
            leftSection={<IconPlus size={14} />}
          >
            Aggiungi
          </Button>
        </Group>
      </Box>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4 }}>
        {isLoading &&
          Array(6)
            .fill(0)
            .map((_, i) => <Skeleton key={i} h={140} />)}
        {covate.map((covata) => (
          <CovataComp
            covata={covata}
            modalElimina={modalElimina}
            modalModifica={modalModifica}
            key={covata.id}
          />
        ))}
      </SimpleGrid>
      <ModalCovata
        isOpen={isOpen}
        annulla={annulla}
        modalData={modalData}
        submit={submit}
      />
      <ModalCancellazione
        isOpen={isDeleteOpen != null}
        onClose={annullaModalCancellazione}
        onDelete={elimina}
        titolo="Elimina Covata"
      />
    </>
  );
}

export default CovatePage;
