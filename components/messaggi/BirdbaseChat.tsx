"use client";
import "stream-chat-react/dist/css/v2/index.css";
import "./custom_components/overrides.scss";
import i18n from "@emoji-mart/data/i18n/it.json";

import { SetStateAction, useCallback, useState } from "react";

import { useSupabase } from "@/providers/SupabaseProvider";
import { useStreamChatStore } from "@/store/StreamChatStore";
import {
  Center,
  Modal,
  MultiSelect,
  PillsInput,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconMoodSmile,
  IconPaperclip,
} from "@tabler/icons-react";
import debounce from "lodash.debounce";
import {
  Channel,
  ChannelFilters,
  ChannelOptions,
  ChannelSort,
  DefaultGenerics,
  UserFilters,
} from "stream-chat";
import {
  Channel as ChannelComp,
  ChannelList,
  ChannelSearchFunctionParams,
  Chat,
  DefaultStreamChatGenerics,
  InfiniteScroll,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { EmojiPicker } from "stream-chat-react/emojis";
import { CustomChannelHeader } from "./custom_components/CustomChannelHeader";
import CustomPreview from "./custom_components/CustomPreview";
import { CustomSearchBar } from "./custom_components/CustomSearchBar";
import { CustomSendButton } from "./custom_components/CustomSendButton";
import ModalCreateChannel from "./custom_components/ModalCreateChannel";

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
  const client = useStreamChatStore((state) => state.chatClient);
  const [channel, setChannel] = useState<Channel<DefaultGenerics>>();
  const [isCreating, setIsCreating] = useState(false);
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
          SearchBar: (props) =>
            CustomSearchBar({
              ...props,
              onCreateChannel: () => setIsCreating(true),
            }),
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
      <ModalCreateChannel
        client={client}
        opened={isCreating}
        onClose={() => setIsCreating(false)}
      />
    </Chat>
  );
}
