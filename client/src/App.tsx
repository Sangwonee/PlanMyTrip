import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalStyle } from "./styles/GlobalStyles";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { ChatArea } from "./components/Chat/ChatArea";
import { InputArea } from "./components/Chat/InputArea";
import { SplitViewToggle } from "./components/SplitView/SplitViewToggle";
import { useChatStore } from "./store/chatStore";
import {
  AppContainer,
  SidebarWrapper,
  ChatContainer,
  ChatContent,
} from "./styles/App.styles";
import DaysMap from "./components/map/DaysMap";
import { SplitView } from "./components/SplitView/SplitView";
import { useSplitViewStore } from "./store/splitViewStore";

const queryClient = new QueryClient();

function ChatApp() {
  const { currentChatId, chats } = useChatStore();
  const { showSplitView } = useSplitViewStore();

  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const hasMessages = currentChat && currentChat.messages.length > 0;

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <SidebarWrapper $isHidden={showSplitView}>
          <Sidebar />
        </SidebarWrapper>

        <ChatContainer $hasSplitView={showSplitView}>
          <ChatContent>
            <ChatArea />
          </ChatContent>
          {hasMessages && <InputArea />}
        </ChatContainer>

        {showSplitView && (
          <SplitView title="여행 일정">
            <DaysMap />
          </SplitView>
        )}

        <SplitViewToggle />
      </AppContainer>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatApp />
    </QueryClientProvider>
  );
}
