"use client";
import "mantine-datatable/styles.css";

import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import { ProfiloWithAllevatore } from "@/types/types";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  Menu,
  Table,
} from "@mantine/core";
import { Pagination } from "@supabase/supabase-js";
import { IconDotsVertical, IconEdit, IconPlus } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";

interface SupabaseUsers {
  users: ProfiloWithAllevatore[];
  pagination: Pagination;
}

const PAGE_SIZE = 25;

function UtentiAdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<ProfiloWithAllevatore[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | undefined>(
    undefined
  );

  const fetchUsers = async (page: number) => {
    setIsLoading(true);
    const res = await apiFetch.get<SupabaseUsers>(
      `/admin/api/users?page_size=${PAGE_SIZE}&page=${page}`
    );
    if (res.error) {
      showNotification({
        message:
          "Si è verificato un errore durante il caricamento degli utenti",
      });
      setIsLoading(false);
      return;
    }
    setUsers(res.data.users);
    setPagination(res.data.pagination);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  return (
    <>
      <Box mb="md">
        <Group justify={"flex-end"}>
          <Button
            data-testid="ButtonAggiungi"
            onClick={() => {}}
            variant="light"
            leftSection={<IconPlus size={14} />}
          >
            Aggiungi
          </Button>
        </Group>
      </Box>
      <Box>
        <DataTable
          records={users}
          columns={[
            { accessor: "allevatore.nome", title: "Nome" },
            { accessor: "allevatore.cognome", title: "Cognome" },
            { accessor: "allevatore.rna", title: "RNA" },
            { accessor: "ruolo", title: "Ruolo" },
            {
              accessor: "actions",
              title: "",
              width: "0%",
              render: (row: ProfiloWithAllevatore) => (
                <Menu shadow="md">
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray">
                      <IconDotsVertical size="14" />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      onClick={() => {
                        console.log("edit: ", row.id);
                      }}
                      leftSection={<IconEdit size="14" />}
                    >
                      Modifica
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
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
          totalRecords={pagination?.total}
          recordsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={(p: any) => setPage(p)}
          fetching={isLoading}
          // 👇 uncomment the next line to use a custom pagination size
          // paginationSize="md"
          // 👇 uncomment the next line to use a custom loading text
          // loadingText="Loading..."
          // 👇 uncomment the next line to display a custom text when no records were found
          // noRecordsText="No records found"
          // 👇 uncomment the next line to use a custom pagination text
          // paginationText={({ from, to, totalRecords }) => `Records ${from} - ${to} of ${totalRecords}`}
          // 👇 uncomment the next lines to use custom pagination colors
          // paginationActiveBackgroundColor="green"
          // paginationActiveTextColor="#e6e348"
        />
      </Box>
    </>
  );
}

export default UtentiAdminPage;
