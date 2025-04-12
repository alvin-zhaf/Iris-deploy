// App.tsx
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Button } from "./components/button";
import AgentsDashboard from "./Dashboard";
import { ReactFlowProvider } from "@xyflow/react";
import DeformCanvas from "./components/DeformCanvas";
import { Globe, LayoutDashboard, Wallet } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
import Logo from "./assets/logo.svg"; // Import the logo SVG file

function HomeScreen({
  walletAddress,
  connectWalletDirectly,
}: {
  walletAddress: string;
  connectWalletDirectly: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div style={styles.homeContainer}>
      {/* Background Canvas */}
      <DeformCanvas />

      {/* Logo and Title */}
      <div style={styles.logoContainer}>
        <img src={Logo} alt="Logo" style={styles.logoImage} />
        <h1 style={styles.titleText}>IRIS</h1>
      </div>

      {/* Top right wallet panel */}
      <div style={styles.topRightPanel}>
        {walletAddress ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="default">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ position: "relative", display: "flex" }}>
                      <span
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          borderRadius: "9999px",
                          backgroundColor: "#4ade80",
                          opacity: 0.75,
                          animation: "ping 1s infinite",
                        }}
                      />
                      <span
                        style={{
                          position: "relative",
                          display: "inline-block",
                          width: 12,
                          height: 12,
                          borderRadius: "9999px",
                          backgroundColor: "#22c55e",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 14 }}>Connected</span>
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p style={{ fontSize: 12, color: "#9ca3af", wordBreak: "break-all" }}>
                  {walletAddress}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <div style={{ position: "relative" }}>
            <Button variant="default" onClick={connectWalletDirectly}>
              <Wallet />
              Connect Wallet
            </Button>
          </div>
        )}
      </div>

      {/* Floating island for prompt UI */}
      <div style={styles.floatingIsland}>
        <div style={styles.glassmorphicContainer}>
          <h1 style={styles.promptHeading}>What can I help with?</h1>
          <div style={styles.promptBar}>
            <input
              type="text"
              placeholder="Ask anything"
              style={styles.promptInput}
            />
          </div>
          <div style={styles.buttonRow}>
            <Button variant="default" onClick={() => navigate("/agents")}>
              <LayoutDashboard />
              Dashboard
            </Button>
            <Button variant="default" onClick={() => navigate("/marketplace")}>
              <Globe />
              Marketplace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper for FlowPage with a Back button
function FlowPageWrapper() {
  return (
    <div style={styles.fullScreenContainer}>
      <ReactFlowProvider>
        <FlowPage />
      </ReactFlowProvider>
    </div>
  );
}

function MarketplaceWrapper() {
  return (
    <div style={styles.fullScreenContainer}>
      <Marketplace />
    </div>
  );
}

// Wrapper for WormholeScreen with a Back button
function WormholeWrapper() {
  const navigate = useNavigate();
  return (
    <div style={styles.fullScreenContainer}>
      <header style={styles.header}>
        <Button variant="outline" onClick={() => navigate("/")}>
          Back
        </Button>
      </header>
      <WormholeScreen />
    </div>
  );
}

// Wrapper for AgentsDashboard
function AgentsDashboardWrapper() {
  return (
    <div style={styles.fullScreenContainer}>
      <AgentsDashboard />
    </div>
  );
}

// Wrapper for Marketreg
function MarketregWrapper() {
  return (
    <div style={styles.fullScreenContainer}>
      <Marketreg />
    </div>
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
        <Route path="/flowpage" element={<FlowPageWrapper />} />
        <Route path="/flowpage/:agentId" element={<FlowPageWrapper />} />
        <Route path="/wormhole" element={<WormholeWrapper />} />
        <Route path="/agents" element={<AgentsDashboardWrapper />} />
        <Route path="/marketplace" element={<MarketplaceWrapper />} />
        <Route path="/marketreg" element={<MarketregWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

const styles = {
  homeContainer: {
    minHeight: "100vh",
    backgroundColor: "#18181b", // Equivalent to bg-zinc-900
    color: "#ffffff",
    position: "relative",
  },
  logoContainer: {
    position: "absolute" as "absolute",
    top: "16.66%",
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none" as "none",
  },
  logoImage: {
    width: "33.33%",
    maxWidth: "32rem",
    opacity: 0.4,
  },
  titleText: {
    position: "absolute" as "absolute",
    fontSize: "8rem",
    fontWeight: 800,
    opacity: 0.9,
    marginTop: "7.5rem",
    fontFamily: "kugile, sans-serif",
    color: "#ffffff",
  },
  topRightPanel: {
    position: "absolute" as "absolute",
    top: "1rem",
    right: "1rem",
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    gap: "0.5rem",
  },
  floatingIsland: {
    position: "absolute" as "absolute",
    top: "55%",
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  glassmorphicContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "1.5rem",
    padding: "2rem",
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2)",
    width: "100%",
    maxWidth: "32rem",
    display: "flex",
    flexDirection: "column" as "column",
    gap: "1.5rem",
  },
  promptHeading: {
    textAlign: "center" as "center",
    fontSize: "2rem",
    fontWeight: 600,
  },
  promptBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#27272a",
    borderRadius: "9999px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    padding: "0.5rem 1rem",
    width: "28rem",
    height: "3.5rem",
  },
  promptInput: {
    flex: 1,
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    color: "#ffffff",
    "::placeholder": {
      color: "#9ca3af",
    },
  },
  buttonRow: {
    display: "flex",
    flexDirection: "column" as "column",
    gap: "1rem",
    justifyContent: "space-between",
    // Media queries are not directly supported in inline styles.
    // For responsive behavior in React (web), consider using CSS or a library.
  },
  fullScreenContainer: {
    minHeight: "100vh",
  },
  header: {
    padding: "1rem",
  },
};