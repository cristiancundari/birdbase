"use client";

import { useEffect, useState } from "react";

import { StreamChat } from "stream-chat";
import {
  Channel as ChannelComp,
  ChannelHeader,
  ChannelList,
  ChannelPreviewProps,
  Chat,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  Window,
  useMessageContext,
} from "stream-chat-react";
import { Channel, DefaultGenerics } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";
import "../style.css";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import { ProfiloWithAllevatore } from "@/types/types";
import { Avatar, Box, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import Image from "next/image";
import { useSupabase } from "@/providers/supabaseProvider";

const apiKey = process.env.NEXT_PUBLIC_STREAM_KEY || "";

interface MessagePageIdProps {
  params: {
    id: string;
  };
}

export default function MessagePageId({ params }: MessagePageIdProps) {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<Channel<DefaultGenerics> | null>(null);
  const supabase = useSupabase();

  useEffect(() => {
    async function init() {
      const chatClient = StreamChat.getInstance(apiKey);

      const request = await apiFetch.post<{
        user: ProfiloWithAllevatore;
        userToken: string;
      }>("/auth/signup", {});
      if (request.error) {
        showNotification({
          message: "Errore durante la connessione al servizio di messaggistica",
        });
        return;
      }

      await chatClient.connectUser(request.data.user, request.data.userToken);

      const channel = chatClient.channel("messaging", {
        members: [request.data.user.id, params.id],
      });

      await channel.watch();

      setChannel(channel);
      setClient(chatClient);

      if (client) return () => client.disconnectUser();
    }

    init();
  }, []);

  if (!client || !channel) return <LoadingIndicator />;
  return (
    <Box id="stream-chat-root">
      <Chat client={client}>
        <ChannelList
          filters={{ members: { $in: [supabase.user?.id || ""] } }}
        />
        <ChannelComp channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </ChannelComp>
      </Chat>
    </Box>
  );
}
