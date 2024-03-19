"use client";
import Navbar from "@/components/Navbar";
import { useStreamChatStore } from "@/store/StreamChatStore";
import StreamChatStoreInit from "@/store/StreamChatStoreInit";
import { Badge, Container } from "@mantine/core";
import {
  IconHome,
  IconWallet,
  IconEggCracked,
  IconTrophy,
  IconClock,
  IconMessages,
  IconSettings,
} from "@tabler/icons-react";
import React, { useCallback, useEffect, useState } from "react";
import { Event } from "stream-chat";

function Layout({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const client = useStreamChatStore((state) => state.chatClient);

  const callback = useCallback((event: Event) => {
    if (event.total_unread_count !== undefined) {
      setUnreadCount(event.total_unread_count);
    }
  }, []);

  useEffect(() => {
    if (!client) return;

    client.on(callback);

    return () => {
      client.off(callback);
    };
  }, [client, callback]);

  const messaggiBadge =
    unreadCount > 0 ? <Badge color="red">{unreadCount}</Badge> : null;

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
      badge: messaggiBadge,
    },
    {
      icon: <IconSettings />,
      label: "Impostazioni",
      url: "/app/impostazioni",
    },
  ];

  return (
    <>
      <Navbar links={links}>
        <Container size="xl" p="sm" h="100%">
          {children}
        </Container>
      </Navbar>
      <StreamChatStoreInit />
    </>
  );
}

export default Layout;
