import { useForm } from '@mantine/form';
import { useRouter } from "next/router";
import { IconAlertCircle, IconUserPlus } from '@tabler/icons-react';
import { useState } from 'react';

import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Container,
  Image,
  Anchor,
  Stack,
  Alert,
} from '@mantine/core';

export default function Register(props) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },

    validate: {
      firstName: (val) => (val.length <1 ? 'Il nome non può essere vuoto' : null),
      lastName: (val) => (val.length <1 ? 'Il cognome non può essere vuoto' : null),
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Email non valida'),
      password: (val) => (val.length <= 6 ? 'La password deve contenere almeno 6 caratteri' : null),
    },
  });
    
  const onFormSubmit = form.onSubmit(
      (values) => {
        setIsLoading(true)
        fetch('/api/auth/register', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values)
        })
        .then((res) => {
            if (res.ok) {
                return router.push('/')
            }
            res.json().then((res) => {
                setError(res.message)
            })
        })
        .finally(() => setIsLoading(false))
    }
  )
  
  return (
    <Container size="xs" mt="lg">
        <Paper radius="md" p="xl" withBorder {...props}>
        <Stack>
            <Text size="xl" weight={500} ta="center" mt="lg">
                Benvenuto su BirdBase
            </Text>
            <Image width={80} mx="auto" src="/logo.jpeg" mt="md" mb="3rem" />
        </Stack>

        <form onSubmit={ (onFormSubmit) }>
            <Stack>
                <TextInput
                    required
                    label="First name"
                    { ...form.getInputProps('firstName') }
                    radius="md"
                />
                <TextInput
                    required
                    label="Last name"
                    { ...form.getInputProps('lastName') }
                    radius="md"
                />
                <TextInput
                    required
                    label="Email"
                    { ...form.getInputProps('email') }
                    radius="md"
                />

                <PasswordInput
                    required
                    label="Password"
                    { ...form.getInputProps('password') }
                    radius="md"
                />
            </Stack>

            { error &&
                <Alert icon={<IconAlertCircle size="1rem" />} color="red" variant="filled" mt="xl">
                    { error }
                </Alert>
            }

            <Group position="apart" mt="xl">
                <Anchor
                    component="button"
                    type="button"
                    color="dimmed"
                    onClick={() => { router.push('/auth/login') }}
                    size="xs"
                >
                    Hai già un'account? Effettua il login
                </Anchor>
                <Button type="submit" radius="xl" leftIcon={<IconUserPlus size="1rem" />} loading={ isLoading }>
                    Registrati
                </Button>
            </Group>
        </form>
        </Paper>
    </Container>
  );
}