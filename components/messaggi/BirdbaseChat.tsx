"use client";

import {
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import { useSupabase } from "@/providers/supabaseProvider";
import { ProfiloWithAllevatore } from "@/types/types";
import { Box, Card, Center, Group, Loader, Tooltip } from "@mantine/core";
import debounce from "lodash.debounce";
import { Channel, DefaultGenerics, StreamChat, UserFilters } from "stream-chat";
import {
  Channel as ChannelComp,
  ChannelHeader,
  ChannelList,
  ChannelListMessengerProps,
  ChannelSearchFunctionParams,
  Chat,
  ChatDownProps,
  InfiniteScroll,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import "./custom_components/overrides.scss";
import { EmojiPicker } from "stream-chat-react/emojis";
import i18n from "@emoji-mart/data/i18n/it.json";
import CustomPreview from "./custom_components/CustomPreview";
import { CustomChannelHeader } from "./custom_components/CustomChannelHeader";
import { CustomSendButton } from "./custom_components/CustomSendButton";
import {
  IconArrowLeft,
  IconCirclePlus,
  IconMoodSmile,
  IconPaperclip,
} from "@tabler/icons-react";
import { CustomSearchBar } from "./custom_components/CustomSearchBar";

const apiKey = process.env.NEXT_PUBLIC_STREAM_KEY || "";

const FileUploadIcon = () => (
  <>
    <Tooltip label="Allega file">
      <IconPaperclip />
    </Tooltip>
  </>
);

const EmojiIcon = () => (
  <>
    <Tooltip label="Scegli un emoji">
      <IconMoodSmile />
    </Tooltip>
  </>
);

export default function BirdbaseChat() {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<Channel<DefaultGenerics> | undefined>(
    undefined
  );
  const supabase = useSupabase();

  const customFetchResults = useCallback(
    debounce(
      async (
        props: ChannelSearchFunctionParams,
        value: SetStateAction<string>
      ) => {
        if (!client) return;

        const { setResults, setSearching } = props;

        const filters: UserFilters<DefaultGenerics> = {
          $and: [
            { name: { $autocomplete: value as string } },
            { id: { $ne: supabase.user!.id } },
          ],
        };

        if (value) {
          const channels = await client.queryUsers(filters);
          setResults(channels.users);
        } else {
          setResults([]);
        }
        setSearching(false);
      },
      300
    ),
    [client]
  );

  const debouncedCustomSearchFunction = useCallback(
    async (
      props: ChannelSearchFunctionParams,
      event: { target: { value: SetStateAction<string> } }
    ) => {
      if (!client) return;

      const { setResults, setSearching, setQuery } = props;
      const value = event.target.value;

      setQuery(value);
      setSearching(true);

      customFetchResults(props, value);
    },
    [client, customFetchResults]
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
  }, [client]);

  if (!client)
    return (
      <Center>
        <LoadingIndicator size={30} />
      </Center>
    );
  return (
    <Group gap={0}>
      <Chat client={client}>
        <ChannelList
          filters={{ members: { $in: [supabase.user!.id] } }}
          Paginator={InfiniteScroll}
          showChannelSearch
          additionalChannelSearchProps={{
            searchFunction: debouncedCustomSearchFunction,
            ExitSearchIcon: IconArrowLeft,
            SearchBar: CustomSearchBar,
          }}
          Preview={CustomPreview}
        />

        <ChannelComp
          channel={channel}
          EmojiPicker={() =>
            EmojiPicker({
              pickerProps: { i18n },
              ButtonIconComponent: EmojiIcon,
            })
          }
          SendButton={CustomSendButton}
          FileUploadIcon={FileUploadIcon}
        >
          <Window>
            <CustomChannelHeader />
            <MessageList />
            <MessageInput maxRows={4} grow />
          </Window>
          <Thread />
        </ChannelComp>
      </Chat>
    </Group>
  );
}
