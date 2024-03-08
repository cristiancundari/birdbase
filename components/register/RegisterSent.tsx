import {
  Center,
  Paper,
  Title,
  Stack,
  Fieldset,
  TextInput,
  SimpleGrid,
  FileInput,
  Box,
  InputWrapper,
  Button,
  InputError,
  Anchor,
  Alert,
  Text,
  Container,
} from "@mantine/core";
import { IconUpload, IconExclamationCircle } from "@tabler/icons-react";
import error from "next/error";
import Link from "next/link";
import React from "react";

function RegisterSent() {
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
            <Title order={2} ta="center">
              {"Registrazione presa in carico"}
            </Title>
            <Text size="md" ta="center" mt="lg">
              {
                "Una volta approvata riceverai un email sull'indirizzo specificato con le istruzioni per impostare le credenziali di accesso."
              }
            </Text>

            <Text mt="lg" ta="center" size="sm" c="dimmed">
              <Anchor component={Link} href="/auth/login">
                {"Vai al login"}
              </Anchor>
            </Text>
          </Paper>
        </Center>
      </Container>
    </>
  );
}

export default RegisterSent;
