"use client";
import { useSupabase } from "@/providers/supabaseProvider";
import "@/styles/navLink.css";
import {
  AppShell,
  Box,
  Burger,
  Button,
  Group,
  NavLink,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBat,
  IconClock,
  IconEggCracked,
  IconHome,
  IconLogout,
  IconMessages,
  IconSettings,
  IconTrophy,
  IconWallet,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import UserLogoutNav from "./UserLogoutNav";

export default function Navbar({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();
  const supabase = useSupabase();
  const pathname = usePathname();

  const logout = async () => {
    await supabase.client.auth.signOut();
    router.push(`/auth/login?callbackUrl=${pathname}`);
  };

  const links = [
    {
      icon: <IconHome />,
      label: "Home",
      url: "/app/home",
    },
    {
      icon: <IconWallet />,
      label: "Portafoglio",
      url: "/app/portafoglio",
    },
    {
      icon: <IconEggCracked />,
      label: "Covate",
      url: "/app/covate",
    },
    {
      icon: <IconTrophy />,
      label: "Gare",
      url: "/app/gare",
    },
    {
      icon: <IconClock />,
      label: "Promemoria",
      url: "/app/promemoria",
    },
    {
      icon: <IconMessages />,
      label: "Messaggi",
      url: "/app/messaggi",
    },
    {
      icon: <IconSettings />,
      label: "Impostazioni",
      url: "/app/impostazioni",
    },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
      bg="gray.0"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <IconBat size={30} />
          <Text fw="bold" size="lg">
            BirdBase
          </Text>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea}>
          {links.map((link, index) => (
            <NavLink
              key={index}
              href={link.url}
              leftSection={link.icon}
              label={link.label}
              active={pathname.startsWith(link.url)}
            />
          ))}
        </AppShell.Section>
        <AppShell.Section>
          <UserLogoutNav logout={logout} />
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <ScrollArea h="calc(100dvh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - 2*var(--app-shell-padding))">
          <Box h="calc(100dvh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - 2*var(--app-shell-padding))">
            {children}
          </Box>
        </ScrollArea>
      </AppShell.Main>
    </AppShell>
  );
}
