import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatStore, Chat, Message } from "../types/chat";

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chats: [],
      currentChatId: null,
      sidebarOpen: true,

      addChat: (chat: Chat) => {
        set((state) => ({
          chats: [chat, ...state.chats],
          currentChatId: chat.id,
        }));
      },

      resetChat: () => {
        set(() => ({
          chats: [],
          currentChatId: null,
        }));
      },

      updateChat: (chatId: string, updates: Partial<Chat>) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, ...updates } : chat
          ),
        }));
      },

      updateMessage: (
        chatId: string,
        messageId: string,
        updates: Partial<Message>
      ) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, ...updates } : msg
                  ),
                }
              : chat
          ),
        }));
      },

      deleteChat: (chatId: string) => {
        set((state) => {
          const newChats = state.chats.filter((chat) => chat.id !== chatId);
          const newCurrentChatId =
            state.currentChatId === chatId
              ? newChats.length > 0
                ? newChats[0].id
                : null
              : state.currentChatId;

          return {
            chats: newChats,
            currentChatId: newCurrentChatId,
          };
        });
      },

      setCurrentChat: (chatId: string | null) => {
        set({ currentChatId: chatId });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },
    }),
    {
      name: "chat-storage",
    }
  )
);
