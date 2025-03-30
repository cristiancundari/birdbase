"use client";
import "mantine-datatable/styles.css";

import RegistrazioneAdminModal from "@/components/admin/registrazioni/registrazioneModal";
import { apiFetch } from "@/lib/apiFetch";
import { formatDataOra, showNotification } from "@/lib/helper";
import { RichiestaRegistrazioneWithCount } from "@/types/types";
import { ActionIcon, Badge, Box, Title, Tooltip } from "@mantine/core";
import { RichiestaRegistrazione } from "@prisma/client";
import { IconEye } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";

const PAGE_SIZE = 25;

function RegistrazioniAdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<RichiestaRegistrazione | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [richiesteRegistrazioneWithCount, setRichiesteRegistrazioneWithCount] = useState<RichiestaRegistrazioneWithCount>();
  const [page, setPage] = useState(1);

  const fetchUsers = async (page: number) => {
    setIsLoading(true);
    const res = await apiFetch.get<RichiestaRegistrazioneWithCount>(`/admin/api/registrazioni?page_size=${PAGE_SIZE}&page=${page}`);
    if (res.error) {
      showNotification({
        message: "Si è verificato un errore durante il caricamento degli utenti",
      });
      setIsLoading(false);
      return;
    }
    setRichiesteRegistrazioneWithCount(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  function onEsaminaClick(richiestaRegistrazione: RichiestaRegistrazione) {
    setModalData(richiestaRegistrazione);
    setIsModalOpen(true);
  }

  function getBadge(status: "approved" | "rejected" | "pending") {
    switch (status) {
      case "approved":
        return (
          <Badge color="teal" variant="filled">
            Approvato
          </Badge>
        );
      case "rejected":
        return (
          <Badge color="red" variant="filled">
            Rifiutato
          </Badge>
        );
      case "pending":
        return (
          <Badge color="orange" variant="filled">
            In attesa
          </Badge>
        );
    }
  }

  return (
    <>
      <Box mb="md">
        <Title order={2}>Richieste di registrazione</Title>
      </Box>
      <Box>
        <DataTable
          records={richiesteRegistrazioneWithCount?.richiesteRegistrazione || ([] as RichiestaRegistrazione[])}
          columns={[
            { accessor: "nome", title: "Nome" },
            { accessor: "cognome", title: "Cognome" },
            { accessor: "rna", title: "RNA" },
            { accessor: "email", title: "Email" },
            {
              accessor: "createdAt",
              title: "Data",
              render: (record) => formatDataOra(record.createdAt),
            },
            {
              accessor: "stato",
              title: "Stato",
              render: (record) => {
                const approvato = record.approvatoIl;
                const rifiutato = record.rifiutatoIl;
                return getBadge(approvato ? "approved" : rifiutato ? "rejected" : "pending");
              },
            },
            {
              accessor: "actions",
              title: "",
              width: "0%",
              render: (row: RichiestaRegistrazione) => (
                <Tooltip label="Esamina">
                  <ActionIcon variant="light" onClick={() => onEsaminaClick(row)} data-testid="btnEsamina">
                    <IconEye size="16" />
                  </ActionIcon>
                </Tooltip>
              ),
            },
          ]}
          withTableBorder
          borderRadius="lg"
          shadow="sm"
          withRowBorders={false}
          striped
          horizontalSpacing="md"
          verticalSpacing="sm"
          totalRecords={richiesteRegistrazioneWithCount?.count}
          recordsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={(p: any) => setPage(p)}
          fetching={isLoading}
        />
      </Box>
      <RegistrazioneAdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onResult={(result) => {
          fetchUsers(page);
        }}
        richiestaRegistrazione={modalData}
      />
    </>
  );
}

export default RegistrazioniAdminPage;
