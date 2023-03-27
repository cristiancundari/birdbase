import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
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
} from '@mantine/core';

export default function Login(props) {
  const [type, toggle] = useToggle(['login', 'registrati']);
  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      email: '',
      name: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });
    
  const onFormSubmit = form.onSubmit(
    (values) => {
        console.log(values)
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

        <form onSubmit={ onFormSubmit }>
            <Stack>
                {type === 'registrati' && (
                    <TextInput
                    label="Name"
                    { ...form.getInputProps('name') }
                    radius="md"
                    />
                )}

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

            <Group position="apart" mt="xl">
                <Anchor
                    component="button"
                    type="button"
                    color="dimmed"
                    onClick={() => toggle()}
                    size="xs"
                >
                    {type === 'registrati'
                    ? 'Hai già un account? effettua il Login'
                    : "Non hai un account? Registrati"}
                </Anchor>
                <Button type="submit" radius="xl">
                    {upperFirst(type)}
                </Button>
            </Group>
        </form>
        </Paper>
    </Container>
  );
}