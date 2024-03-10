"use client";
import { useSupabase } from "@/providers/SupabaseProvider";
import "@/styles/navLink.css";
import {
  AppShell,
  Box,
  Burger,
  Group,
  NavLink,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBat } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import UserLogoutNav from "./UserLogoutNav";

interface NavbarProps {
  links: {
    icon: React.ReactNode;
    label: string;
    url: string;
    badge?: React.ReactNode;
  }[];
}

export default function Navbar({
  children,
  links,
}: PropsWithChildren<NavbarProps>) {
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();
  const supabase = useSupabase();
  const pathname = usePathname();

  const logout = async () => {
    await supabase.client.auth.signOut();
    router.push(`/auth/login?callbackUrl=${pathname}`);
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
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
              component={Link}
              key={index}
              href={link.url}
              leftSection={link.icon}
              label={link.label}
              active={pathname.startsWith(link.url)}
              rightSection={link.badge}
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
