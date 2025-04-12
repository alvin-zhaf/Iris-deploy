import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { BarChart, List, ArrowLeft, Home } from "lucide-react";
import FocusGraph3D from "../components/FocusGraph3D";

// -------------------- ANIMATION & BACKGROUND EFFECTS -------------------- //

// A very smooth fade-in and slide-up animation for the full-page Graph overlay.
const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Starry background effect using radial gradients.
const starryBackground = `
  radial-gradient(white 1px, transparent 1px),
  radial-gradient(white 1px, transparent 1px)
`;

const StarField = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  background-image: ${starryBackground};
  background-size: 40px 40px, 80px 80px;
  opacity: 0.2;
  animation: moveStars 60s linear infinite;
  pointer-events: none;

  @keyframes moveStars {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(-50px, -50px, 0);
    }
  }
`;

// -------------------- PAGE & CONTAINER STYLES -------------------- //

const Container = styled.div`
  background-color: #18181b;
  min-height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// -------------------- FIXED HEADER WITH CONTROLS -------------------- //

const Header = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 12;
`;

const CenteredTitle = styled.h1`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  margin: 0;
  font-size: 1.5rem;
`;

const ControlButton = styled.button`
  background: rgba(25, 25, 25, 0.95);
  border: 1px solid rgba(127, 86, 217, 0.3);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: rgba(25, 25, 25, 1);
    transform: translateY(-2px);
  }
`;

// -------------------- AGENT LIST STYLES -------------------- //

const AgentListContainer = styled.div`
  width: 80%;
  margin-top: 140px; /* Increased margin to avoid being stuck at the top */
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(250px, 1fr)
  ); /* Grid layout */
  gap: 1rem; /* Spacing between cards */
  padding-bottom: 2rem; /* Add some bottom padding */
`;

const AgentCard = styled.div<{ isExpanded: boolean }>`
  background-color: #27272a;
  border-radius: 10px;
  border: 2px solid transparent;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem; /* Increased padding */
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    border: 2px solid #d8b4fe; /* Pink border highlight on hover */
  }

  transform: ${(props) =>
    props.isExpanded ? "scale(1.05)" : "scale(1)"}; /* Scale on click */
`;

const AgentTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #d8b4fe;
`;

const AgentDescription = styled.p`
  font-size: 0.9rem;
  margin-bottom: 1rem;
  color: #fff;
`;

const PerformanceMetrics = styled.div`
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 1rem;
`;

// -------------------- FULL-PAGE GRAPH OVERLAY -------------------- //

const GraphOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  animation: ${fadeInUp} 0.6s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ToggleSwitch = styled.div`
  position: fixed;
  top: 70px; /* Positioned below header */
  left: 50%;
  transform: translateX(-50%);
  width: 240px;
  height: 50px;
  background-color: #44444a;
  border-radius: 999px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  z-index: 11;
`;

const ToggleOption = styled.div<{ active: boolean }>`
  flex: 1;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: ${({ active }) => (active ? "#fff" : "#bbb")};
  transition: color 0.6s ease;

  svg {
    stroke: ${({ active }) => (active ? "#fff" : "#bbb")};
    margin-right: 0.5rem;
    transition: stroke 0.6s ease;
  }
`;

const SwitchCircle = styled.div<{ active: boolean }>`
  position: absolute;
  width: 50%;
  height: 100%;
  border-radius: 999px;
  background-color: #7f56d9;
  top: 0;
  left: ${({ active }) => (active ? "50%" : "0%")};
  transition: left 0.6s ease;
  z-index: 1;
`;

// -------------------- MOCK DATA -------------------- //

const agentsData = [
  {
    name: "Agent Alpha",
    owner: "John Doe",
    description: "An advanced AI assistant for handling complex tasks.",
    timeCreated: "2023-01-15",
    freqUsed: "1500 times",
    performance: { speed: "90%", accuracy: "85%" },
  },
  {
    name: "Agent Beta",
    owner: "Jane Smith",
    description:
      "A reliable agent for customer support with fast response time.",
    timeCreated: "2023-02-20",
    freqUsed: "1000 times",
    performance: { speed: "80%", accuracy: "90%" },
  },
  {
    name: "Agent Gamma",
    owner: "Michael Lee",
    description: "A highly specialized agent for data analysis.",
    timeCreated: "2023-03-10",
    freqUsed: "1200 times",
    performance: { speed: "70%", accuracy: "95%" },
  },
];

// -------------------- MAIN COMPONENT -------------------- //

const Agents: React.FC = () => {
  // false: List view, true: Graph (3D universe) view.
  const [isDetailView, setIsDetailView] = useState(false);
  // Track which agent card is expanded
  const [expandedAgentIndex, setExpandedAgentIndex] = useState<number | null>(
    null
  );

  const toggleView = () => {
    setIsDetailView((prev) => !prev);
  };

  const handleBack = () => {
    window.history.back();
  };

  const goToDashboard = () => {
    window.location.href = "/dashboard";
  };

  const toggleAgentExpanded = (index: number) => {
    setExpandedAgentIndex(expandedAgentIndex === index ? null : index);
  };

  return (
    <Container>
      {/* Fixed Header with Back and Dashboard buttons */}
      <Header>
        <ControlButton onClick={handleBack}>
          <ArrowLeft size={18} /> Back
        </ControlButton>
        <CenteredTitle>
          {isDetailView ? "Universe" : "Available Agents"}
        </CenteredTitle>
        <ControlButton onClick={goToDashboard}>
          <Home size={18} /> Dashboard
        </ControlButton>
      </Header>

      {/* Fixed Toggle Switch below the header */}
      <ToggleSwitch onClick={toggleView}>
        <SwitchCircle active={isDetailView} />
        <ToggleOption active={!isDetailView}>
          <List size={20} /> List
        </ToggleOption>
        <ToggleOption active={isDetailView}>
          <BarChart size={20} /> Graph
        </ToggleOption>
      </ToggleSwitch>

      {/* Render the Agent List when in List mode */}
      {!isDetailView && (
        <AgentListContainer>
          {agentsData.map((agent, index) => (
            <AgentCard
              key={index}
              isExpanded={expandedAgentIndex === index}
              onClick={() => toggleAgentExpanded(index)}
            >
              <AgentTitle>{agent.name}</AgentTitle>
              <AgentDescription>{agent.description}</AgentDescription>
              {expandedAgentIndex === index && (
                <PerformanceMetrics>
                  <p>
                    <strong>Speed:</strong> {agent.performance.speed}
                  </p>
                  <p>
                    <strong>Accuracy:</strong> {agent.performance.accuracy}
                  </p>
                  <p>
                    <strong>Created:</strong> {agent.timeCreated}
                  </p>
                  <p>
                    <strong>Used:</strong> {agent.freqUsed}
                  </p>
                </PerformanceMetrics>
              )}
            </AgentCard>
          ))}
        </AgentListContainer>
      )}

      {/* Render full-page Graph overlay when in Graph mode */}
      {isDetailView && (
        <GraphOverlay>
          <StarField />
          <FocusGraph3D />
        </GraphOverlay>
      )}
    </Container>
  );
};

export default Agents;
