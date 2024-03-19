"use client";
import {
  Alert,
  Anchor,
  Button,
  Center,
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useSupabase } from "@/providers/SupabaseProvider";
import Link from "next/link";
import { Role } from "@prisma/client";

function Login() {
  const supabase = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callback");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    setError("");
  }, [form.values]);

  const handleSignIn = form.onSubmit(async (values) => {
    try {
      setIsLoading(true);
      const res = await supabase.client.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (!res.error) {
        // Login successful
        // Check if the user is an admin
        const profile = await supabase.client
          .from("profili")
          .select("id")
          .eq("id", res.data.user.id)
          .eq("ruolo", Role.ADMIN)
          .single();
        if (profile.data) {
          // User is an admin. Redirect to admin home
          router.push(decodeURIComponent(callbackUrl || "/admin/home"));
          router.refresh();
          return;
        }
        // User is a user. Redirect to user home
        router.push(decodeURIComponent(callbackUrl || "/app/home"));
        router.refresh();
        return;
      } else {
        setError(
          "Se non ricordi le credenziali contatta un amministratore per il reset"
        );
        setIsLoading(false);
      }
    } catch (error: any) {
      setError(error);
      setIsLoading(false);
    }
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
              {"Accedi"}
            </Title>
            <Text size="md" ta="center">
              {"Effettua l'accesso per poter utilizzare l'app"}
            </Text>
            <form onSubmit={handleSignIn}>
              <Stack mt="md" gap="lg">
                <TextInput
                  size="md"
                  label="Email"
                  placeholder="mario.rossi@mail.com"
                  {...form.getInputProps("email")}
                />
                <PasswordInput
                  size="md"
                  label="Password"
                  placeholder="••••••••"
                  {...form.getInputProps("password")}
                />
                <Button size="md" loading={isLoading} type="submit">
                  {"Accedi"}
                </Button>
              </Stack>
            </form>

            <Text mt="lg" ta="center" size="sm" c="dimmed">
              {"Sei un allevatore ma non hai ancora un account? "}
              <Anchor component={Link} href="/auth/register">
                {"Registrati"}
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

export default Login;
