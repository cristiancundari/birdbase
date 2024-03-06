"use client";

import { SetStateAction, useCallback, useEffect, useState } from "react";

import { StreamChat } from "stream-chat";
import {
  Channel as ChannelComp,
  ChannelHeader,
  ChannelList,
  ChannelPreviewProps,
  ChannelSearchFunctionParams,
  Chat,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  Window,
  useMessageContext,
} from "stream-chat-react";
import { debounce } from "lodash";
import { Channel, DefaultGenerics } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";
import "./style.css";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import { ProfiloWithAllevatore } from "@/types/types";
import {
  Avatar,
  Box,
  Group,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import Image from "next/image";
import { useSupabase } from "@/providers/supabaseProvider";
import { useDebouncedValue } from "@mantine/hooks";

const apiKey = process.env.NEXT_PUBLIC_STREAM_KEY || "";

export default function WhatsAppChat() {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<Channel<DefaultGenerics> | undefined>(
    undefined
  );
  const supabase = useSupabase();

  const customSearchFunction = useCallback(
    async (
      props: ChannelSearchFunctionParams,
      event: { target: { value: SetStateAction<string> } }
    ) => {
      console.log("customSearchFunction");
      if (!client) return;

      const { setResults, setSearching, setQuery } = props;
      const value = event.target.value;

      if (!value) {
        setQuery("");
        setResults([]);
        setSearching(false);
        return;
      }

      const filters = {
        name: { $autocomplete: value as string },
      };

      setSearching(true);
      setQuery(value);
      const channels = await client.queryUsers(filters);
      setResults(channels.users);
      setSearching(false);
    },
    [client]
  );

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

      setChannel(undefined);
      setClient(chatClient);

      if (client) return () => client.disconnectUser();
    }

    init();
  }, []);

  if (!client) return <LoadingIndicator />;
  return (
    <Box id="stream-chat-root">
      <Chat client={client}>
        <ChannelList
          filters={{ members: { $in: [supabase.user!.id] } }}
          showChannelSearch
          additionalChannelSearchProps={{
            searchFunction: async (props, event) => {
              return await debounce(customSearchFunction, 300)(props, event);
            },
          }}
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
