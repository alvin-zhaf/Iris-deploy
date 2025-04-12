import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import DeformCanvas from "../components/DeformCanvas";
import { Globe, LayoutDashboard, Wallet } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/Tooltip";
import Logo from "../assets/logo.svg";
import styled from "styled-components";
import Dashboard from "./Dashboard";

function HomeScreen({
  walletAddress,
  connectWalletDirectly,
}: {
  walletAddress: string;
  connectWalletDirectly: () => void;
}) {
  const navigate = useNavigate();

  return (
    <Styled.HomeContainer>
      {/* Background Canvas */}
      <DeformCanvas />

      {/* Logo and Title */}
      <Styled.LogoContainer>
        <Styled.LogoImage src={Logo} alt="Logo" />
      </Styled.LogoContainer>
      <Styled.TitleText>IRIS</Styled.TitleText>

      {/* Top right wallet panel */}
      <Styled.TopRightPanel>
        {walletAddress ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Styled.ConnectButton variant="default">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div style={{ position: "relative", display: "flex" }}>
                      <span style={Styled.PulseStyles.pulseCircle} />
                      <span style={Styled.PulseStyles.pulseDot} />
                    </div>
                    <span style={{ fontSize: 14 }}>Connected</span>
                  </div>
                </Styled.ConnectButton>
              </TooltipTrigger>
              <TooltipContent>
                <p
                  style={{
                    fontSize: 12,
                    color: "#cfcfcf",
                    wordBreak: "break-all",
                  }}
                >
                  {walletAddress}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Styled.ConnectButton
            variant="default"
            onClick={connectWalletDirectly}
          >
            <Wallet size={16} />
            Connect Wallet
          </Styled.ConnectButton>
        )}
      </Styled.TopRightPanel>

      {/* Floating island for prompt UI */}
      <Styled.FloatingIsland>
        <Styled.GlassmorphicContainer>
          <Styled.PromptHeading>What can I help with?</Styled.PromptHeading>
          <Styled.PromptBar>
            <Styled.PromptInput type="text" placeholder="Ask anything" />
          </Styled.PromptBar>
          <Styled.ButtonRow>
            <Styled.ConnectButton onClick={() => navigate("/dashboard")}>
              <LayoutDashboard size={18} />
              Dashboard
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

function App() {
  const [walletAddress, setWalletAddress] = useState<string>("");

  const connectWalletDirectly = async () => {
    try {
      if ((window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          console.log("Direct wallet connection successful:", accounts[0]);
        }
      } else {
        alert(
          "No Ethereum wallet detected. Please install MetaMask or another supported wallet."
        );
      }
    } catch (error) {
      console.error("Error connecting wallet directly:", error);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomeScreen
              walletAddress={walletAddress}
              connectWalletDirectly={connectWalletDirectly}
            />
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

/* ----------------------------------------------------------------------
   STYLED COMPONENTS
---------------------------------------------------------------------- */
export const Styled = {
  /* === Containers & Layout === */
  HomeContainer: styled.div`
    min-height: 100vh;
    color: #ffffff;
    position: relative;
    overflow: hidden;
    background-color: #18181b;
  `,
  LogoContainer: styled.div`
    position: absolute;
    top: 50%; /* Adjust this to center it vertically */
    left: 50%;
    transform: translate(-50%, -50%); /* Center the container */
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
    pointer-events: none;
  `,
  LogoImage: styled.img`
    width: 30vw; /* Make the logo larger */
    max-width: 300px;
    opacity: 0.4;
    margin-bottom: 200px; /* Adjust spacing */
    max-width: none;
  `,
  TitleText: styled.h1`
    position: absolute; /* Position the title absolutely inside the page */
    top: 45%; /* Move the title vertically to the center of the page */
    left: 50%; /* Move the title horizontally to the center of the page */
    transform: translate(-50%, -50%); /* Adjust for exact centering */
    font-size: 8rem; /* Increase the font size for the title */
    font-weight: 900;
    font-family: "kugile";
    color: #fff; /* White color for the title */
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
    top: 65%; /* Keep it as it is, this will keep the floating island lower */
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
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
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
    width: 30%;
    align-self: center;
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

  /* === Buttons (Uniform style for wallet, dashboard, and marketplace) === */
  ConnectButton: styled(Button)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    height: 2.5rem;
    padding: 0 1rem;
    font-size: 0.9rem;
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

  /* === Small Inline Styles for animated pulse === */
  PulseStyles: {
    pulseCircle: {
      position: "absolute" as const,
      width: "100%",
      height: "100%",
      borderRadius: "9999px",
      backgroundColor: "#22c55e",
      opacity: 0.6,
      animation: "ping 1s infinite",
    },
    pulseDot: {
      position: "relative" as const,
      display: "inline-block",
      width: "0.75rem",
      height: "0.75rem",
      borderRadius: "9999px",
      backgroundColor: "#22c55e",
    },
  },
};
