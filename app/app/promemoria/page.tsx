"use client";
import ModalCancellazione from "@/components/ModalCancellazione";
import ModalPromemoria, {
  FormValues,
} from "@/components/promemoria/ModalPromemoria";
import PromemoriaComp from "@/components/promemoria/PromemoriaComp";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import { Box, Button, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { Promemoria } from "@prisma/client";
import { IconPlus } from "@tabler/icons-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import React, { useEffect, useState } from "react";

function Promemoria() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState<Date | null>(new Date());
  const [modalData, setModalData] = useState<Promemoria | null>(null);
  const [promemoria, setPromemoria] = useState<Promemoria[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState<number | null>(null);

  useEffect(() => {
    getPromemoria();
  }, [value]);

  const getPromemoria = async () => {
    const res = await apiFetch.get(`/api/promemoria?data=${value}`);
    if (res.error) {
      showNotification({ message: res.message });
    } else {
      setPromemoria(res.data);
    }
  };

  const aggiungiPromemoria = async (value: FormValues) => {
    const res = await apiFetch.post("/api/promemoria", value);
    if (res.error) {
      showNotification({ message: res.message });
    } else {
      showNotification({
        message: "Promemoria inserito correttamente",
        success: true,
      });
      getPromemoria();
    }
  };

  const elimina = async () => {
    if (isDeleteOpen) {
      const res = await apiFetch.delete(`/api/promemoria/${isDeleteOpen}`);
      if (res.error) {
        showNotification({ message: res.message });
      } else {
        showNotification({
          message: "Promemoria cancellato correttamente",
          success: true,
        });
        getPromemoria();
      }
    }
  };

  const submit = async (value: FormValues) => {
    if (modalData) {
      modificaPromemoria(value);
    } else {
      aggiungiPromemoria(value);
    }
  };

  const annulla = () => {
    setIsModalOpen(false);
  };

  const addHandler = () => {
    setIsModalOpen(true);
  };

  function modalElimina(id: number) {
    setIsDeleteOpen(id);
  }

  function annullaModalCancellazione() {
    setIsDeleteOpen(null);
  }

  const modalModifica = async (promemoria: Promemoria) => {
    setModalData(promemoria);
    setIsModalOpen(true);
  };

  const modificaPromemoria = async (value: FormValues) => {
    const result = await apiFetch.patch(
      `/api/promemoria/${modalData?.id}`,
      value
    );
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "Il Promemoria è stato modificato correttamente",
        success: true,
      });
      getPromemoria();
    }
  };

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
        <SimpleGrid cols={2} mt={"md"}>
          <Group align="center" grow>
            <Stack>
              <DatePicker
                value={value}
                onChange={setValue}
                defaultValue={new Date()}
                size="lg"
                m="auto"
              />
            </Stack>
          </Group>
          <Box>
            <Text fz="xl" fw={700} c="blue" mb="lg">
              {value && format(value, "dd MMMM", { locale: it })}
            </Text>
            <Box
              style={{
                display: "grid",
                gridTemplateColumns: "auto auto 1fr auto",
                gap: "20px",
              }}
            >
              {promemoria.length > 0 ? (
                promemoria.map((value, index) => (
                  <PromemoriaComp
                    value={value}
                    modalElimina={modalElimina}
                    modalModifica={modalModifica}
                    key={index}
                  />
                ))
              ) : (
                <Text>Nessun Promemoria da Visualizzare</Text>
              )}
            </Box>
          </Box>
        </SimpleGrid>
      </Box>
      <ModalPromemoria
        isOpen={isModalOpen}
        annulla={annulla}
        submit={submit}
        modalData={modalData}
      />
      <ModalCancellazione
        data-testid="ModalCancellazione"
        isOpen={isDeleteOpen != null}
        onClose={annullaModalCancellazione}
        onDelete={elimina}
        titolo="Elimina Promemoria"
      />
    </>
  );
}

export default Promemoria;
