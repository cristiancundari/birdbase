"use client";
import { AppShell, Burger, Group, NavLink, Text } from "@mantine/core";
import {
  Icon360,
  IconBarrel,
  IconBat,
  IconFlag,
  IconHome,
  IconTrophy,
  IconWallet,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import "@/styles/navLink.css";
import { usePathname } from "next/navigation";

export default function Navbar({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();

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
      icon: <IconBarrel />,
      label: "Gabbie",
      url: "/app/gabbie",
    },
    {
      icon: <IconTrophy />,
      label: "Gare",
      url: "/app/gare",
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
        {links.map((link, index) => (
          <NavLink
            key={index}
            href={link.url}
            leftSection={link.icon}
            label={link.label}
            active={pathname.startsWith(link.url)}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
