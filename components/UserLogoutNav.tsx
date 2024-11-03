import { useSupabase } from "@/providers/SupabaseProvider";
import {
  Avatar,
  Group,
  Menu,
  Paper,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronRight, IconLock, IconLogout } from "@tabler/icons-react";
import assert from "assert";
import ModalChangePassword from "./ModalChangePassword";
import { useState } from "react";

interface UserLogoutNavProps {
  logout: () => void;
}

function UserLogoutNav({ logout }: UserLogoutNavProps) {
  const supabase = useSupabase();
  const user = supabase.user;
  assert(user, "Non autenticato");
  const fullName = user.allevatore.nome + " " + user.allevatore.cognome;
  const theme = useMantineTheme();
  const [isOpen, setIsOpen] = useState(false);

  function onClose() {
    setIsOpen(false);
  }

  return (
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <UnstyledButton w="100%" data-testid="logout-menu">
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
          <Menu.Item
            p="sm"
            leftSection={<IconLock size="1rem" />}
            onClick={() => setIsOpen(true)}
          >
            Cambia Password
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <ModalChangePassword isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default UserLogoutNav;
