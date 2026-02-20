import { useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./styles/GlobalStyles";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { ChatArea } from "./components/Chat/ChatArea";
import { InputArea } from "./components/Chat/InputArea";
import {
  AppContainer,
  SidebarWrapper,
  ChatContainer,
  ChatContent,
} from "./styles/App.styles";
import DaysMap from "./components/map/DaysMap";
import { SplitView } from "./components/SplitView/SplitView";
import { useSplitViewStore } from "./store/splitViewStore";
import { useTravelScheduleStore } from "./store/travelScheduleStore";
import { useUserPlanInfoStore } from "./store/userPlanInfoStore";
import { useChatStore } from "./store/chatStore";
import LandingPage from "./pages/LandingPage";
import PlanFormPage from "./pages/PlanFormPage";
import ScheduleEditorPanel from "./components/ScheduleEditor/ScheduleEditorPanel";
import WorkspaceModeHeader from "./components/Chat/WorkspaceModeHeader";

const queryClient = new QueryClient();

function ChatApp() {
  const { showSplitView, setSplitViewOpen, toggleSplitView } = useSplitViewStore();
  const { travelSchedule, deleteTravelSchedule, addTravelSchedule } = useTravelScheduleStore();
  const { updateUserPlanInfoField } = useUserPlanInfoStore();
  const { currentChatId, panelMode, chats } = useChatStore();

  const placeCount = useMemo(
    () => travelSchedule.reduce((acc, day) => acc + day.plan.length, 0),
    [travelSchedule]
  );

  useEffect(() => {
    deleteTravelSchedule();
    setSplitViewOpen(false);
    updateUserPlanInfoField("userInput", "");
  }, [currentChatId, deleteTravelSchedule, setSplitViewOpen, updateUserPlanInfoField]);

  useEffect(() => {
    if (travelSchedule.length > 0) return;
    if (!currentChatId) return;

    const currentChat = chats.find((chat) => chat.id === currentChatId);
    const latestAssistant = currentChat?.messages
      .slice()
      .reverse()
      .find((msg) => msg.role === "assistant" && msg.content.length > 0 && !msg.isLoading);

    if (latestAssistant) {
      addTravelSchedule(latestAssistant.content);
    }
  }, [travelSchedule.length, currentChatId, chats, addTravelSchedule]);

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <SidebarWrapper $isHidden={showSplitView}>
          <Sidebar />
        </SidebarWrapper>

        <ChatContainer $hasSplitView={showSplitView}>
          <WorkspaceModeHeader
            showSplitView={showSplitView}
            onToggleSplitView={toggleSplitView}
            placeCount={placeCount}
          />
          <ChatContent>
            {panelMode === "editor" ? <ScheduleEditorPanel /> : <ChatArea />}
          </ChatContent>
          {panelMode === "chat" && <InputArea />}
        </ChatContainer>

        {showSplitView && (
          <SplitView title="여행 일정">
            <DaysMap />
          </SplitView>
        )}
      </AppContainer>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GlobalStyle />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/plan" element={<PlanFormPage />} />
          <Route path="/chat" element={<ChatApp />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
