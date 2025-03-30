"use client";
import { apiFetch } from "@/lib/apiFetch";
import {
  Alert,
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Fieldset,
  FileInput,
  InputError,
  InputWrapper,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconExclamationCircle, IconUpload } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

interface IFormData {
  nome: string;
  cognome: string;
  rna: string;
  email: string;
  documentoIdentita: File | null;
  documentoIscrizione: File | null;
}

const maxFileSize = 5 * 1024 * 1024;

function isEmailValid(email: string) {
  return z.string().email().safeParse(email).success;
}

function Register() {
  const documentoIdentitaRef = useRef<HTMLButtonElement>(null);
  const documentoIscrizioneRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<IFormData>({
    initialValues: {
      nome: "",
      cognome: "",
      rna: "",
      email: "",
      documentoIdentita: null,
      documentoIscrizione: null,
    },
    validate: {
      nome: (value) => value.length == 0 && "Inserisci nome",
      cognome: (value) => value.length == 0 && "Inserisci cognome",
      rna: (value) => value.length == 0 && "Inserisci RNA",
      email: (value) =>
        value.length == 0
          ? "Inserisci email"
          : !isEmailValid(value) && "Inserisci un'email valida",
      documentoIdentita: (value) =>
        value == null
          ? "Carica documento"
          : value.size > maxFileSize && "Dimensione massima 5MB",
      documentoIscrizione: (value) =>
        value == null
          ? "Carica documento"
          : value.size > maxFileSize && "Dimensione massima 5MB",
    },
  });

  useEffect(() => {
    setError("");
  }, [form.values]);

  const handleSubmit = form.onSubmit(async (values) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("nome", values.nome);
    formData.append("cognome", values.cognome);
    formData.append("rna", values.rna);
    formData.append("email", values.email);
    formData.append("documentoIdentita", values.documentoIdentita as Blob);
    formData.append("documentoIscrizione", values.documentoIscrizione as Blob);
    const res = await apiFetch.postFormData("/pubapi/register", formData);
    if (res.error) {
      setError(res.message);
      setIsLoading(false);
      return;
    }
    return router.push("/auth/register/sent");
  });

  return (
    <>
      <Container
        size="responsive"
        maw={{ base: "40em", sm: "48em" }}
        w="100%"
        h="100vh"
      >
        <Center h="100%">
          <Paper
            shadow="sm"
            w="100%"
            px={{ base: "3rem", xs: "8rem" }}
            py="7rem"
          >
            <Title order={1} ta="center">
              {"Registrati"}
            </Title>
            <Text size="md" ta="center">
              {"Sei un allevatore? Richiedi l'accesso per utilizzare l'app"}
            </Text>

            <form onSubmit={handleSubmit}>
              <Stack mt="md" gap="md">
                <Fieldset legend="Dati personali">
                  <Stack gap="md">
                    <TextInput
                      size="sm"
                      label="Nome"
                      placeholder="Mario"
                      {...form.getInputProps("nome")}
                    />
                    <TextInput
                      size="sm"
                      label="Cognome"
                      placeholder="Rossi"
                      {...form.getInputProps("cognome")}
                    />
                    <TextInput
                      size="sm"
                      label="RNA"
                      placeholder="00XX"
                      {...form.getInputProps("rna")}
                    />
                    <TextInput
                      size="sm"
                      label="Email"
                      placeholder="mariorossi@mail.com"
                      description="Riceverai qui le tue credenziali di accesso"
                      {...form.getInputProps("email")}
                    />
                  </Stack>
                </Fieldset>
                <Fieldset legend="Documenti">
                  <SimpleGrid cols={2}>
                    <FileInput
                      ref={documentoIdentitaRef}
                      clearable
                      label="Documento di identità"
                      accept="image/*"
                      {...form.getInputProps("documentoIdentita")}
                      style={
                        form.values.documentoIdentita == null
                          ? { display: "none" }
                          : {}
                      }
                    />
                    {form.values.documentoIdentita == null && (
                      <Box w="100%">
                        <InputWrapper
                          label="Documento di identità"
                          labelProps={{ htmlFor: "documentoIdentitaBtn" }}
                        >
                          <Button
                            color={
                              form.errors["documentoIdentita"]
                                ? "red"
                                : undefined
                            }
                            style={{
                              marginBottom:
                                "calc(var(--mantine-spacing-xs) / 2)",
                            }}
                            variant="outline"
                            id="documentoIdentitaBtn"
                            leftSection={<IconUpload size={16} />}
                            fullWidth
                            onClick={() =>
                              documentoIdentitaRef.current?.click()
                            }
                          >
                            Carica
                          </Button>
                          {form.errors["documentoIdentita"] && (
                            <InputError>
                              {form.errors["documentoIdentita"]}
                            </InputError>
                          )}
                        </InputWrapper>
                      </Box>
                    )}

                    <FileInput
                      ref={documentoIscrizioneRef}
                      clearable
                      label="Documento iscrizione FOI"
                      accept="image/*"
                      {...form.getInputProps("documentoIscrizione")}
                      style={
                        form.values.documentoIscrizione == null
                          ? { display: "none" }
                          : {}
                      }
                    />
                    {form.values.documentoIscrizione == null && (
                      <Box w="100%">
                        <InputWrapper
                          label="Documento iscrizione FOI"
                          labelProps={{ htmlFor: "documentoIscrizioneBtn" }}
                        >
                          <Button
                            color={
                              form.errors["documentoIscrizione"]
                                ? "red"
                                : undefined
                            }
                            style={{
                              marginBottom:
                                "calc(var(--mantine-spacing-xs) / 2)",
                            }}
                            variant="outline"
                            id="documentoIscrizioneBtn"
                            leftSection={<IconUpload size={16} />}
                            fullWidth
                            onClick={() =>
                              documentoIscrizioneRef.current?.click()
                            }
                          >
                            Carica
                          </Button>
                          {form.errors["documentoIscrizione"] && (
                            <InputError>
                              {form.errors["documentoIscrizione"]}
                            </InputError>
                          )}
                        </InputWrapper>
                      </Box>
                    )}
                  </SimpleGrid>
                </Fieldset>
                <Button size="md" loading={isLoading} type="submit">
                  {"Registrati"}
                </Button>
              </Stack>
            </form>

            <Text mt="lg" ta="center" size="sm" c="dimmed">
              {"Hai già un account? "}
              <Anchor component={Link} href="/auth/login">
                {"Accedi"}
              </Anchor>
            </Text>

            {error && (
              <Alert
                mt="lg"
                variant="light"
                color="red"
                title="Si è verificato un errore"
                icon={<IconExclamationCircle />}
              >
                {error}
              </Alert>
            )}
          </Paper>
        </Center>
      </Container>
    </>
  );
}

export default Register;
