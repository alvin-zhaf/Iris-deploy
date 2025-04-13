import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import DeformCanvas from "../components/DeformCanvas";
import { Globe, Orbit, Wallet, Send, LayoutDashboard } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/Tooltip";
import Logo from "../assets/logo.svg";
import styled, { keyframes, css } from "styled-components";
import Agents from "./Agents";

/* ================================================
   ModalWorkflow Component – Popup showing Workflow Timeline
   ================================================ */
interface Workflow {
  id: string;
  title: string;
  detail: string;
  status: string;
}

interface ModalWorkflowProps {
  wsData?: string;
  onClose: () => void;
}

// Keyframe animations for dots
const glow = keyframes`
  0% { box-shadow: 0 0 6px rgba(40, 167, 69, 0.4); }
  50% { box-shadow: 0 0 16px rgba(40, 167, 69, 0.8); }
  100% { box-shadow: 0 0 6px rgba(40, 167, 69, 0.4); }
`;

const pulseRing = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255,165,0,0.6); }
  50% { box-shadow: 0 0 0 10px rgba(255,165,0,0); }
  100% { box-shadow: 0 0 0 0 rgba(255,165,0,0); }
`;

const flicker = keyframes`
  0% { transform: translateX(0); }
  10% { transform: translateX(-1px); }
  20% { transform: translateX(1px); }
  30% { transform: translateX(-1px); }
  40% { transform: translateX(1px); }
  50% { transform: translateX(-1px); }
  60% { transform: translateX(1px); }
  70% { transform: translateX(-1px); }
  80% { transform: translateX(1px); }
  90% { transform: translateX(-1px); }
  100% { transform: translateX(0); }
`;

// Loading Animation: three dots
const dotAnimation = keyframes`
  0%, 20%, 40%, 100% { opacity: 0.2; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-5px); }
`;

const LoadingText = styled.div`
  font-size: 1.2rem;
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
`;

const Dot = styled.span`
  display: inline-block;
  margin: 0 2px;
  animation: ${dotAnimation} 1.4s infinite;
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
`;

// Styled Components for the modal workflow UI
const WorkflowHeadingBanner = styled.div`
  background-color: rgba(127,86,217,0.15);
  border: 1px solid rgba(127,86,217,0.5);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  text-align: center;
`;

const VerticalTimelineContainer = styled.div`
  position: relative;
  margin: 2rem 0;
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2.5rem;
`;

// Updated TimelineDot: mapping statuses to colors
const TimelineDot = styled.div<{ status: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  font-weight: bold;
  color: #000;
  background-color: ${({ status }) => {
    if (status === "progress_started") return "#FFC107"; // yellow for started
    if (status === "progress_finished") return "#28a745"; // green for finished
    if (status === "inProgress") return "#FFA500"; // orange for processing
    if (status === "failure") return "#dc3545"; // red for failure
    return "#777"; // fallback
  }};
  animation: ${({ status }) => {
    if (status === "progress_started")
      return css`${pulseRing} 2s infinite`;
    if (status === "inProgress")
      return css`${glow} 2s infinite`;
    if (status === "failure")
      return css`${flicker} 0.7s infinite`;
    return "none";
  }};
  &:hover { transform: scale(1.15); }
`;

const TimelineContent = styled.div`
  background-color: #1a1a1a;
  border: 1px solid rgba(127,86,217,0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-left: 1rem;
  flex: 1;
`;

const TimelineTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: bold;
`;

const TimelineDetail = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #ccc;
`;

const ModalContent = styled.div`
  background: #0f0f0f;
  border-radius: 8px;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 30px rgba(0,0,0,0.8);
  position: relative;
  padding: 1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
`;

// ModalWorkflow: If wsData is not available or if no workflow items can be built, show loading animation.
const ModalWorkflow: React.FC<ModalWorkflowProps> = ({ wsData, onClose }) => {
  useEffect(() => {
    console.log("ModalWorkflow mounted with wsData:", wsData);
  }, [wsData]);

  let workflows: Workflow[] = [];
  if (wsData) {
    try {
      const parsed = JSON.parse(wsData);
      console.log("Parsed wsData:", parsed);
      if (parsed && parsed.type && parsed.data) {
        // Build two items: one for input receipt, one for current agent
        workflows.push({
          id: "input",
          title: "Input Received",
          detail: parsed.data.original || parsed.data.input || "",
          status: "progress_started", // yellow dot
        });
        // The agent is processing:
        workflows.push({
          id: parsed.data.current_agent.id,
          title: parsed.data.current_agent.name,
          detail: parsed.data.current_agent.description,
          status: "inProgress", // orange dot
        });
      }
    } catch (error) {
      console.error("Error parsing wsData:", error);
    }
  }
  
  // If there are no workflows (wsData not received or parsed), show a loading message.
  if (workflows.length === 0) {
    return (
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <WorkflowHeadingBanner>Processing...</WorkflowHeadingBanner>
        <LoadingText>
          Processing<Dot>.</Dot><Dot>.</Dot><Dot>.</Dot>
        </LoadingText>
      </ModalContent>
    );
  }

  return (
    <ModalContent>
      <CloseButton onClick={onClose}>&times;</CloseButton>
      <WorkflowHeadingBanner>
        Workflow Progress
      </WorkflowHeadingBanner>
      <VerticalTimelineContainer>
        {workflows.map((wf, index) => (
          <TimelineItem key={index}>
            <TimelineDot status={wf.status} title={`${wf.id} - ${wf.title}\n${wf.detail}`}>
              {index + 1}
            </TimelineDot>
            <TimelineContent>
              <TimelineTitle>{`${wf.id} - ${wf.title}`}</TimelineTitle>
              <TimelineDetail>{wf.detail}</TimelineDetail>
            </TimelineContent>
          </TimelineItem>
        ))}
      </VerticalTimelineContainer>
    </ModalContent>
  );
};

/* ================================================
   Modal Overlay – Popup that blurs background
   ================================================ */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* ================================================
   Styled Components for HomeScreen UI
   ================================================ */
export const Styled = {
  HomeContainer: styled.div`
    min-height: 100vh;
    color: #ffffff;
    position: relative;
    overflow: hidden;
    background-color: #18181b;
  `,
  LogoContainer: styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
    pointer-events: none;
  `,
  LogoImage: styled.img`
    width: 30vw;
    max-width: 300px;
    opacity: 0.4;
    margin-bottom: 200px;
  `,
  TitleText: styled.h1`
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 8rem;
    font-weight: 900;
    font-family: "kugile";
    color: #fff;
    z-index: 2;
    margin-top: 0;
  `,
  TopRightPanel: styled.div`
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    z-index: 3;
  `,
  FloatingIsland: styled.div`
    position: absolute;
    top: 65%;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    transform: translateY(-50%);
    z-index: 3;
  `,
  GlassmorphicContainer: styled.div`
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    width: 100%;
    max-width: 32rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  `,
  PromptHeading: styled.h1`
    font-size: 2.2rem;
    font-weight: 600;
    color: #ffffff;
  `,
  PromptBar: styled.div`
    display: flex;
    align-self: center;
    background-color: rgba(255, 255, 255, 0.07);
    border-radius: 9999px;
    padding: 0.5rem 1rem;
    width: 90%;
    height: 2.5rem;
    justify-content: space-between;
  `,
  PromptInput: styled.input`
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #ffffff;
    font-size: 1.2rem;
    padding: 0.2rem 0.5rem;
    &::placeholder {
      color: #c0c0c0;
    }
  `,
  SendButton: styled.button`
    background: transparent;
    border: none;
    color: #7f56d9;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    transition: color 0.2s ease;
    &:hover {
      color: #9b66ff;
    }
  `,
  ButtonRow: styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: space-between;
    @media (min-width: 640px) {
      flex-direction: row;
    }
  `,
  ConnectButton: styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    height: 2.5rem;
    padding: 0 1rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 9999px;
    color: #ffffff;
    background-color: #7f56d9;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.15s ease;
    &:hover {
      background-color: #9b66ff;
    }
    &:active {
      transform: scale(0.98);
    }
  `,
  WalletStatusDisplay: styled.div`
    height: 2.5rem;
    padding: 0 1rem;
    background-color: #27272a;
    border-radius: 9999px;
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    & .flex-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      height: 100%;
    }
    & .pulse-container {
      position: relative;
      display: flex;
    }
    & .pulse-ping {
      position: absolute;
      height: 100%;
      width: 100%;
      border-radius: 9999px;
      background-color: #4ade80;
      opacity: 0.75;
      animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    & .pulse-dot {
      position: relative;
      display: inline-flex;
      height: 0.75rem;
      width: 0.75rem;
      border-radius: 9999px;
      background-color: #22c55e;
    }
    & .connected-text {
      font-size: 0.9rem;
      font-weight: 600;
    }
    @keyframes ping {
      75%, 100% {
        transform: scale(2);
        opacity: 0;
      }
    }
  `,
};

/* ================================================
   HomeScreen Component – Main UI
   ================================================ */
function HomeScreen({
  walletAddress,
  connectWalletDirectly,
  sendMessage,
  openWorkflowModal,
}: {
  walletAddress: string;
  connectWalletDirectly: () => void;
  sendMessage: (message: string) => void;
  openWorkflowModal: () => void;
}) {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit clicked, inputValue:", inputValue);
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");
      console.log("Opening workflow modal after submit.");
      openWorkflowModal();
    } else {
      console.log("Input empty. Not sending message.");
    }
  };

  return (
    <Styled.HomeContainer>
      <DeformCanvas />
      <Styled.LogoContainer>
        <div
          style={{
            position: "absolute",
            top: "20%",
            zIndex: -1,
            width: "25rem",
            height: "20rem",
            backgroundColor: "#8d00ff",
            borderRadius: "50%",
            filter: "blur(50px)",
            opacity: 0.12,
          }}
        />
        <Styled.LogoImage src={Logo} alt="Logo" />
      </Styled.LogoContainer>
      <Styled.TitleText>IRIS</Styled.TitleText>
      <Styled.TopRightPanel>
        {walletAddress ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Styled.WalletStatusDisplay>
                  <div className="flex-container">
                    <div className="pulse-container">
                      <span className="pulse-ping"></span>
                      <span className="pulse-dot"></span>
                    </div>
                    <span className="connected-text">Connected</span>
                  </div>
                </Styled.WalletStatusDisplay>
              </TooltipTrigger>
              <TooltipContent>
                <p className="wallet-address">{walletAddress}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <div className="wallet-button-container">
            <Styled.ConnectButton onClick={connectWalletDirectly}>
              <Wallet size={16} />
              Connect Wallet
            </Styled.ConnectButton>
          </div>
        )}
      </Styled.TopRightPanel>
      <Styled.FloatingIsland>
        <Styled.GlassmorphicContainer>
          <Styled.PromptHeading>What can I help with?</Styled.PromptHeading>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Styled.PromptBar>
              <Styled.PromptInput
                type="text"
                placeholder="Ask anything"
                value={inputValue}
                onChange={(e) => {
                  console.log("Input changed:", e.target.value);
                  setInputValue(e.target.value);
                }}
              />
              <Styled.SendButton type="submit">
                <Send size={18} />
              </Styled.SendButton>
            </Styled.PromptBar>
          </form>
          <Styled.ButtonRow>
            {/* Navigation buttons (optional) */}
            <Styled.ConnectButton onClick={openWorkflowModal}>
              <LayoutDashboard size={18} />
              Dashboard
            </Styled.ConnectButton>
            <Styled.ConnectButton onClick={() => navigate("/universe")}>
              <Orbit size={18} />
              Universe
            </Styled.ConnectButton>
            <Styled.ConnectButton onClick={() => navigate("/marketplace")}>
              <Globe size={18} />
              Marketplace
            </Styled.ConnectButton>
          </Styled.ButtonRow>
        </Styled.GlassmorphicContainer>
      </Styled.FloatingIsland>
    </Styled.HomeContainer>
  );
}

/* ================================================
   Main App Component – Puts Everything Together
   ================================================ */
function App() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [wsData, setWsData] = useState<string | null>(null);
  const [showWorkflowModal, setShowWorkflowModal] = useState<boolean>(false);

  const sendMessage = (message: string) => {
    console.log("Opening WebSocket to send message:", message);
    const ws = new WebSocket("ws://localhost:8000/ws");
    ws.onopen = () => {
      console.log("WebSocket connection opened for sending message");
      ws.send(JSON.stringify({ input: message, wallet: walletAddress }));
      console.log(`Message sent: ${message}`);
    };
    ws.onmessage = (event) => {
      const response = event.data;
      console.log("WebSocket message received:", response);
      setWsData(response);
      ws.close();
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      ws.close();
    };
  };

  const connectWalletDirectly = async () => {
    try {
      if ((window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          console.log("Wallet connected:", accounts[0]);
        }
      } else {
        alert("No Ethereum wallet detected. Please install MetaMask.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const openWorkflowModal = () => {
    console.log("Opening workflow modal");
    setShowWorkflowModal(true);
  };

  const closeWorkflowModal = () => {
    console.log("Closing workflow modal");
    setShowWorkflowModal(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HomeScreen
                walletAddress={walletAddress}
                connectWalletDirectly={connectWalletDirectly}
                sendMessage={sendMessage}
                openWorkflowModal={openWorkflowModal}
              />
              {showWorkflowModal && (
                <ModalOverlay>
                  <ModalWorkflow wsData={wsData || undefined} onClose={closeWorkflowModal} />
                </ModalOverlay>
              )}
            </>
          }
        />
        <Route path="/universe" element={<Agents />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;