import { apiFetch } from "@/lib/apiFetch";
import { useStreamChatStore } from "@/store/StreamChatStore";
import { ProfiloWithAllevatore } from "@/types/types";
import { showNotification } from "@mantine/notifications";
import { User } from "@supabase/supabase-js";
import { useEffect } from "react";
import { StreamChat } from "stream-chat";

function StreamChatStoreInit() {
  const streamChatStoreUser = useStreamChatStore((state) => state.user);
  const streamChatStoreSetUser = useStreamChatStore((state) => state.setUser);
  const streamChatStoreChatClient = useStreamChatStore(
    (state) => state.chatClient
  );
  const streamChatStoreSetChatClient = useStreamChatStore(
    (state) => state.setChatClient
  );

  useEffect(() => {
    async function init() {
      const client = StreamChat.getInstance(
        process.env.NEXT_PUBLIC_STREAM_KEY!,
        process.env.STREAM_SECRET!
      );

      if (
        !streamChatStoreUser.id &&
        !streamChatStoreUser.token &&
        !streamChatStoreChatClient
      ) {
        const result = await apiFetch.post<{
          user: ProfiloWithAllevatore;
          streamUsers: User[];
          userToken: string;
        }>("/auth/stream-token");

        if (result.error) {
          showNotification({
            message:
              "Non è stato possibile connettersi al servizio di messagistica. Riprova più tardi.",
          });
          console.error(result.error);
          return;
        }

        streamChatStoreSetUser({
          id: result.data.user.id,
          token: result.data.userToken,
        });

        await client.connectUser(
          {
            id: result.data.user.id,
          },
          result.data.userToken
        );

        streamChatStoreSetChatClient(client);
      }
    }

    init();
  }, [
    streamChatStoreUser,
    streamChatStoreSetUser,
    streamChatStoreChatClient,
    streamChatStoreSetChatClient,
  ]);
  return null;
}

export default StreamChatStoreInit;
