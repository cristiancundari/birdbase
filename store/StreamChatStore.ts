import { create } from "zustand";
import { StreamChat } from "stream-chat";

interface StreamChatStore {
  chatClient: StreamChat | null;
  setChatClient: (chatClient: StreamChat) => void;
  user: {
    id: string;
    token: string;
  };
  setUser: (user: { id: string; token: string }) => void;
  channel: any;
  setChannel: (channel: any) => void;
}

export const useStreamChatStore = create<StreamChatStore>((set) => ({
  chatClient: null,
  setChatClient: (chatClient) => set({ chatClient }),
  user: {
    id: "",
    token: "",
  },
  setUser: (user) => set({ user }),
  channel: null,
  setChannel: (channel) => set({ channel }),
}));
