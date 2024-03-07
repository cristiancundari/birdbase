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
import {
  Channel,
  DefaultGenerics,
  StreamChat,
  UserFilters,
  ChannelSort,
  ChannelOptions,
  ChannelFilters,
} from "stream-chat";
import {
  Channel as ChannelComp,
  ChannelHeader,
  ChannelList,
  ChannelListMessengerProps,
  ChannelSearchFunctionParams,
  Chat,
  ChatDownProps,
  DefaultStreamChatGenerics,
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
import { User } from "stream-chat";
import { CustomSearchBar } from "./custom_components/CustomSearchBar";
import { useStreamClient } from "./useClientHook";

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
  const [streamUser, setStreamUser] = useState<{ user?: User; token?: string }>(
    { user: undefined, token: undefined }
  );
  const client = useStreamClient(
    streamUser
      ? { user: streamUser.user, tokenOrProvider: streamUser.token }
      : { user: undefined, tokenOrProvider: undefined }
  );
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
      const request = await apiFetch.post<{
        user: ProfiloWithAllevatore;
        streamUsers: User[];
        userToken: string;
      }>("/auth/signup", {});
      if (request.error || request.data.streamUsers.length === 0) {
        showNotification({
          message: "Errore durante la connessione al servizio di messaggistica",
        });
        return;
      }

      setStreamUser({ user: request.data.user, token: request.data.userToken });

      setChannel(undefined);
    }

    init();
  }, []);

  if (!client)
    return (
      <Center w="100%" h="100%">
        <LoadingIndicator size={30} />
      </Center>
    );

  const filters: ChannelFilters<DefaultStreamChatGenerics> = {
    members: { $in: [supabase.user!.id] },
  };
  const options: ChannelOptions = { presence: true, state: true, watch: true };
  const sort: ChannelSort<DefaultStreamChatGenerics> = { last_message_at: -1 };

  return (
    <Chat client={client}>
      <ChannelList
        filters={filters}
        options={options}
        sort={sort}
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
  );
}
