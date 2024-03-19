import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import { createClient } from "@/lib/supabase/client";
import {
  Button,
  Group,
  Input,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { set } from "date-fns";
import React, { useEffect } from "react";

interface ModalChangePasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

function ModalChangePassword({ isOpen, onClose }: ModalChangePasswordProps) {
  useEffect(() => {
    if (isOpen) form.reset();
  }, [isOpen]);
  const form = useForm({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      repeatPassword: "",
    },
    validate: {
      oldPassword: (value) =>
        value.length == 0 ? "Inserisci la vecchia password" : null,
      newPassword: (value, values) =>
        value.length == 0
          ? "Inserisci la nuova password"
          : value === values.oldPassword
          ? "La nuova password non può essere uguale a quella vecchia"
          : null,
      repeatPassword: (value, values) =>
        value.length == 0
          ? "Inserisci il valore della nuova password"
          : value !== values.newPassword
          ? "Le due password non coincidono"
          : null,
    },
  });

  async function cambiaPassword() {
    const supabase = createClient();
    const check = await supabase.rpc("change_user_password", {
      current_plain_password: form.values.oldPassword,
      new_plain_password: form.values.newPassword,
    });
    if (check.error) {
      return showNotification({
        message: "Il server ha riscontrato un errore",
      });
    }
    if (check.data.error) {
      return showNotification({
        message: check.data.message,
      });
    }
    showNotification({
      message: "Password cambiata con successo",
      success: true,
    });
    onClose();
  }

  return (
    <Modal opened={isOpen} onClose={onClose} title="Cambia password">
      <form onSubmit={form.onSubmit(cambiaPassword)}>
        <Stack>
          <TextInput
            type="password"
            label={"Vecchia password"}
            autoComplete="current-password"
            {...form.getInputProps("oldPassword")}
          />
          <TextInput
            type="password"
            label={"Nuova password"}
            autoComplete="new-password"
            {...form.getInputProps("newPassword")}
          />
          <TextInput
            type="password"
            label={"Ripeti password"}
            autoComplete="new-password"
            {...form.getInputProps("repeatPassword")}
          />
        </Stack>

        <Group justify="end" mt="lg">
          <Button
            onClick={onClose}
            leftSection={<IconX />}
            variant="outline"
            color="gray"
          >
            Annulla
          </Button>
          <Button
            type="submit"
            leftSection={<IconDeviceFloppy />}
            color="green"
          >
            Salva
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default ModalChangePassword;
