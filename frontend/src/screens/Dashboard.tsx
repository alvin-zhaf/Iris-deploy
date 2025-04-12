// Dashboard.tsx
import { useState, useEffect, KeyboardEvent } from "react";
import { Search, PlusCircle, BarChart2, Bot, PlayCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { ScrollArea } from "../components/ScrollArea";
import { ArrowLeft } from "lucide-react";
import logo from "../assets/logo.svg";
import styled from "styled-components";

export default function Dashboard() {
  const [agents, setAgents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [focusedAgentIndex, setFocusedAgentIndex] = useState<number>(-1);
  const navigate = useNavigate();

  // Real-time agents collection listener.
  useEffect(() => {
    const agentsRef = collection(db, "agents");
    const unsubscribe = onSnapshot(
      agentsRef,
      (snapshot) => {
        const agentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAgents(agentsData);
      },
      (error) => {
        console.error("Error fetching agents:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Filter agents based on search term.
  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle keyboard navigation on agent cards.
  const handleAgentKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    index: number,
    agentId: string
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/flowpage/${agentId}`);
    }
  };

  const handlePlayClick = (e: React.MouseEvent, agentId: string) => {
    e.stopPropagation();
    console.log(`Play agent: ${agentId}`);
  };

  const handlePlayKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    agentId: string
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      console.log(`Play agent: ${agentId}`);
    }
  };

  return (
    <Container>
      {/* Sidebar */}
      <Sidebar>
        <SidebarHeader>
          <SidebarBrand>
            <SidebarLogo src={logo} alt="Logo" />
            <SidebarTitle style={{ fontFamily: "kugile" }}>IRIS</SidebarTitle>
          </SidebarBrand>
          <div>
            <SidebarItem tabIndex={0}>
              <Bot size={18} />
              <span>Agents</span>
            </SidebarItem>
            <SidebarItem tabIndex={0}>
              <BarChart2 size={18} />
              <span>Stats</span>
            </SidebarItem>
          </div>
        </SidebarHeader>
        <SidebarFooter>
          <BackLink to="/" tabIndex={0}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </BackLink>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        {/* Search Bar */}
        <SearchBarContainer>
          <StyledInput
            type="text"
            placeholder="Search for Agents here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            tabIndex={0}
          />
          <SearchIcon size={20} />
        </SearchBarContainer>

        {/* Agents Grid */}
        <ScrollArea style={{ flex: 1, height: "calc(100vh - 160px)" }}>
          <GridContainer>
            {filteredAgents.map((agent, index) => (
              <AgentCard
                key={agent.id}
                focused={index === focusedAgentIndex}
                onClick={() => navigate(`/flowpage/${agent.id}`)}
                onKeyDown={(e) => handleAgentKeyDown(e, index, agent.id)}
                tabIndex={0}
                role="button"
                aria-label={`Agent: ${agent.name}`}
              >
                <AgentCardHeader>
                  <AgentInfo>
                    <AgentAvatar />
                    <AgentName>{agent.name}</AgentName>
                  </AgentInfo>
                  <PlayButton
                    tabIndex={0}
                    aria-label={`Run ${agent.name}`}
                    onClick={(e) => handlePlayClick(e, agent.id)}
                    onKeyDown={(e) => handlePlayKeyDown(e, agent.id)}
                  >
                    <PlayCircle size={24} style={{ color: "#a78bfa" }} />
                  </PlayButton>
                </AgentCardHeader>
                <AgentDescription>
                  Agent purpose: {agent.description}
                </AgentDescription>
              </AgentCard>
            ))}
          </GridContainer>
        </ScrollArea>

        {/* Create New Button */}
        <CreateNewButton
          onClick={() => navigate("/flowpage")}
          tabIndex={0}
        >
          <PlusCircle size={18} />
          <span>Create New</span>
        </CreateNewButton>
      </MainContent>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #18181b; /* bg-zinc-900 */
  color: #d1d5db; /* gray-300 */
  overflow: hidden;
  width: 100vw;   
`;

const Sidebar = styled.div`
  width: 15rem;
  border-right: 1px solid #27272a; /* border-gray-800 */
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgb(39, 39, 42);
`;

const SidebarHeader = styled.div`
  margin-bottom: 1rem;
`;

const SidebarBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SidebarLogo = styled.img`
  width: 3rem; /* Approx w-12 */
  height: auto;
  object-fit: contain;
`;

const SidebarTitle = styled.h3`
  font-size: 1.875rem; /* text-3xl */
  font-weight: bold;
  color: #d8b4fe; /* text-purple-300 */
  padding-top: 1rem;
`;

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  color: #ffffff;
  transition: color 0.3s;
  cursor: pointer;
  &:hover {
    color: #a78bfa;
  }
  &:focus {
    outline: none;
    color: #a78bfa;
  }
`;

const SidebarFooter = styled.div`
  margin-bottom: 0.5rem;
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  margin-bottom: 2rem;
  color: #a78bfa;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  position: relative;
  width: 100%;
`;

const SearchBarContainer = styled.div`
  position: relative;
  margin: 0.5rem 1rem 2rem 1rem;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem 3rem 0.5rem 1rem; /* extra right padding for the icon */
  border-radius: 0.5rem;
  background-color: #27272a; /* bg-zinc-800 */
  color: #d1d5db;
  border: none;
  &:focus {
    outline: none;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280; /* text-gray-500 */
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 0 1rem 5rem 1rem;
`;

interface AgentCardProps {
  focused: boolean;
}

const AgentCard = styled.div<AgentCardProps>`
  background-color: #27272a; /* bg-zinc-800 / or bg-[rgb(39,39,42)] */
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  border: 2px solid ${({ focused }) => (focused ? "#a78bfa" : "transparent")};
  transition: border-color 0.3s;
  &:hover {
    border-color: #a78bfa;
  }
  &:focus {
    outline: none;
    border-color: #c084fc;
  }
`;

const AgentCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const AgentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AgentAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: #a78bfa;
  border-radius: 9999px;
`;

const AgentName = styled.span`
  color: #d1d5db;
  &:hover {
    text-decoration: underline;
  }
`;

const PlayButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #3f3f46;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #a78bfa;
  }
`;

const AgentDescription = styled.div`
  font-size: 0.875rem;
  opacity: 0.7;
`;

const CreateNewButton = styled.button`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #8b5cf6;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #7c3aed;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #a78bfa;
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem;
  border: none;
  background-color: #dc2626;  /* red background */
  border-radius: 9999px;
  cursor: pointer;
  color: #ffffff;
  font-size: 0.9rem;
  transition: background-color 0.2s, transform 0.15s ease;
  &:hover {
    background-color: #e11d48;
  }
  &:active {
    transform: scale(0.98);
  }
`;