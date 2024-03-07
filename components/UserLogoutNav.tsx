import { useSupabase } from "@/providers/supabaseProvider";
import {
  Avatar,
  Group,
  Menu,
  Paper,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronRight, IconLogout } from "@tabler/icons-react";
import assert from "assert";

function UserLogoutNav({ logout }: { logout: () => void }) {
  const supabase = useSupabase();
  const user = supabase.user;
  assert(user, "Non autenticato");
  const fullName = user.allevatore.nome + " " + user.allevatore.cognome;
  const theme = useMantineTheme();

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton w="100%">
          <Paper withBorder p="sm">
            <Group>
              <Avatar src={null} alt={fullName} color={theme.primaryColor}>
                {fullName
                  .split(" ")
                  .map((str) => str.charAt(0))
                  .join("")
                  .toUpperCase()}
              </Avatar>
              <Text size="sm" fw={500} style={{ flexGrow: 1 }}>
                {fullName}
              </Text>
              <IconChevronRight size="1rem" />
            </Group>
          </Paper>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          p="sm"
          leftSection={<IconLogout size="1rem" />}
          onClick={logout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default UserLogoutNav;
