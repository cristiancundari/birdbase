"use client";
import Navbar from "@/components/Navbar";
import { useStreamChatStore } from "@/store/StreamChatStore";
import StreamChatStoreInit from "@/store/StreamChatStoreInit";
import { Badge, Container } from "@mantine/core";
import {
  IconMessages,
  IconShield,
  IconTrophy,
  IconUsers,
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
      icon: <IconTrophy />,
      label: "Gare",
      url: "/admin/gare",
    },
    {
      icon: <IconMessages />,
      label: "Messaggi",
      url: "/admin/messaggi",
      badge: messaggiBadge,
    },
    {
      icon: <IconShield />,
      label: "Registrazioni",
      url: "/admin/registrazioni",
    },
    {
      icon: <IconUsers />,
      label: "Utenti",
      url: "/admin/utenti",
    },
  ];

  return (
    <>
      <Navbar links={links}>
        <Container size="xl" p={0} h="100%">
          {children}
        </Container>
      </Navbar>
      <StreamChatStoreInit />
    </>
  );
}

export default Layout;
