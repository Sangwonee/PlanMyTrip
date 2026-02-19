import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./styles/GlobalStyles";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { ChatArea } from "./components/Chat/ChatArea";
import { InputArea } from "./components/Chat/InputArea";
import { SplitViewToggle } from "./components/SplitView/SplitViewToggle";
import {
  AppContainer,
  SidebarWrapper,
  ChatContainer,
  ChatContent,
} from "./styles/App.styles";
import DaysMap from "./components/map/DaysMap";
import { SplitView } from "./components/SplitView/SplitView";
import { useSplitViewStore } from "./store/splitViewStore";
import LandingPage from "./pages/LandingPage";
import PlanFormPage from "./pages/PlanFormPage";

const queryClient = new QueryClient();

function ChatApp() {
  const { showSplitView } = useSplitViewStore();

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
          <InputArea />
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
