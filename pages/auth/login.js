import { useForm } from '@mantine/form';
import { useRouter } from "next/router";
import { IconLogin, IconAlertCircle } from '@tabler/icons-react';
import { signIn } from 'next-auth/react';
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

export default function Login(props) {
  const router = useRouter()
  const [ isLoading, setIsLoading ] = useState(false)
  const [ error, setError ] = useState("")
  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      email: '',
      password: '',
    },
  });
    
  const onFormSubmit = form.onSubmit(
    async (values) => {
      setIsLoading(true)
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        callbackUrl: '/',
        redirect: false
      })
      if (result.ok) {
        router.push(result.url)
      }
      setError(result.error)
      setIsLoading(false)
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
                    label="Email"
                    { ...form.getInputProps('email') }
                    error={form.errors.email && 'Formato email non valido'}
                    radius="md"
                />

                <PasswordInput
                    required
                    label="Password"
                    { ...form.getInputProps('password') }
                    error={form.errors.password && 'La password deve includere almeno 6 caratteri'}
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
                    onClick={() => { router.push('/auth/register') }}
                    size="xs"
                >
                    Non hai un account? Registrati
                </Anchor>
                <Button type="submit" radius="xl" leftIcon={<IconLogin />} loading={ isLoading }>
                    Login
                </Button>
            </Group>
        </form>
        </Paper>
    </Container>
  );
}