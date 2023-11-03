"use client";
import {
  Flex,
  Container,
  Button,
  Center,
  Stack,
  Modal,
  Group,
  TextInput,
  Select,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SoggettoComp from "./soggetto";
import { Soggetto } from "@prisma/client";
import {
  IconDeviceFloppy,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { DateInput, DatePicker } from "@mantine/dates";
import { Form, useForm } from "@mantine/form";
import errorNotificationClasses from "@/styles/errorNotification.module.css";

function Homepage({ soggetti }: { soggetti: Soggetto[] }) {
  const [ismodalaggiungiopen, setismodalaggiungiopen] = useState(false);
  const router = useRouter();

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      rna: "",
      numeroanelletto: "",
      datadinascita: "",
      sesso: "",
    },
    validate: {
      rna: (value) => (value.length == 0 ? "Inserire RNA" : null),
      sesso: (value) => (value.length == 0 ? "Seleziona il sesso" : null),
    },
  });

  const btnAggiungi = () => {
    setismodalaggiungiopen(true);
  };

  const annulla = () => {
    setismodalaggiungiopen(false);
  };

  const aggiungi = async () => {
    const result = await fetch("/api/soggetto", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(form.values),
    });
    setismodalaggiungiopen(false);
    if (result.ok) {
      router.refresh();
    } else {
      const res = await result.json();
      notifications.show({
        title: "Errore",
        message: res.result,
        withBorder: true,
        classNames: errorNotificationClasses,
      });
    }
  };

  return (
    <>
      <Container>
        <Group justify={"flex-end"}>
          <Button
            onClick={btnAggiungi}
            variant="light"
            leftSection={<IconPlus size={14} />}
          >
            Aggiungi
          </Button>
        </Group>
        <Center>
          <Stack>
            {soggetti.map((soggetto) => {
              return <SoggettoComp key={soggetto.id} dati={soggetto} />;
            })}
          </Stack>
        </Center>
      </Container>
      <Modal
        opened={ismodalaggiungiopen}
        onClose={() => setismodalaggiungiopen(false)}
        title="Aggiungi Soggetto"
        centered
      >
        <form
          onSubmit={form.onSubmit(() => {
            aggiungi();
          })}
        >
          <Group grow>
            <TextInput label="RNA" {...form.getInputProps("rna")}></TextInput>
            <TextInput
              label="Numero"
              {...form.getInputProps("numeroanelletto")}
            ></TextInput>
          </Group>
          <Group grow>
            <DateInput
              label="Data di nascita"
              {...form.getInputProps("datadinascita")}
            ></DateInput>
            <Select
              {...form.getInputProps("sesso")}
              label="Sesso"
              data={["Maschio", "Femmina", "In Attesa"]}
            ></Select>
          </Group>

          <Flex justify={"space-between"} mt={"lg"}>
            <Button
              variant="outline"
              onClick={annulla}
              leftSection={<IconX size={14} />}
            >
              Annulla
            </Button>
            <Button
              color="green"
              leftSection={<IconDeviceFloppy size={14} />}
              type="submit"
            >
              Salva
            </Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
}

export default Homepage;
