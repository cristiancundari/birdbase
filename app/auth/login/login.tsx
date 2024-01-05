"use client";
import {
  Alert,
  Button,
  Center,
  Container,
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
import { useSupabase } from "@/providers/supabaseProvider";

function Login() {
  const supabase = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/app/home";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    initialValues: {
      username: "",
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
        email: `${values.username}@gmail.com`,
        password: values.password,
      });
      if (!res?.error) {
        return router.push(callbackUrl);
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
          <Paper shadow="sm" w="100%" px="8rem" py="7rem">
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
                  label="Username"
                  placeholder="MarioRossi"
                  {...form.getInputProps("username")}
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
