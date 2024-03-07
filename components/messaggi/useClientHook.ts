import { useEffect, useState } from "react";
import { StreamChat, TokenOrProvider, User } from "stream-chat";

export type UseClientOptions = {
  user: User;
  tokenOrProvider: TokenOrProvider;
};

export const useStreamClient = ({
  user,
  tokenOrProvider,
}: Partial<UseClientOptions>): StreamChat | undefined => {
  const [chatClient, setChatClient] = useState<StreamChat>();

  useEffect(() => {
    if (!user || !user.id || !tokenOrProvider) {
      return;
    }
    const client = new StreamChat(process.env.NEXT_PUBLIC_STREAM_KEY!);
    // prevents application from setting stale client (user changed, for example)
    let didUserConnectInterrupt = false;

    const connectionPromise = client
      .connectUser(user, tokenOrProvider)
      .then(() => {
        if (!didUserConnectInterrupt) {
          setChatClient(client);
        }
      });

    return () => {
      didUserConnectInterrupt = true;
      setChatClient(undefined);
      // wait for connection to finish before initiating closing sequence
      connectionPromise
        .then(() => client.disconnectUser())
        .then(() => {
          console.log("connection closed");
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- should re-run only if user.id changes
  }, [user, tokenOrProvider]);

  return chatClient;
};
