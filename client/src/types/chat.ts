import type { PlanDataType } from "./api";

export interface Message {
  id: string;
  message: string;
  content: PlanDataType[];
  role: "user" | "assistant";
  timestamp: Date;
  isLoading?: boolean;
  isError: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatStore {
  chats: Chat[];
  currentChatId: string | null;
  sidebarOpen: boolean;

  resetChat: () => void;
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  updateMessage: (
    chatId: string,
    messageId: string,
    updates: Partial<Message>
  ) => void;
  deleteChat: (chatId: string) => void;
  setCurrentChat: (chatId: string | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}
