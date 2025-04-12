import React, { useState } from "react";
import styled from "styled-components";
import { BarChart, List, ArrowLeft, Home, LayoutDashboard } from "lucide-react";

// -------------------- PAGE STYLES -------------------- //

const Container = styled.div`
  background-color: #18181b;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  width: 80%;
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: #fff;
  margin: 0;
  flex: 1;
  text-align: center;
`;

const AgentListContainer = styled.div`
  width: 80%;
  margin-top: 2rem;
`;

const AgentCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const AgentTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const AgentDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #555;
`;

const PerformanceMetrics = styled.div`
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 1rem;
`;


// -------------------- CONTROL BUTTONS -------------------- //

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
  font-size: 1.3rem;

  &:hover {
    background: rgba(25, 25, 25, 1);
    transform: translateY(-2px);
  }
`;

// -------------------- CUSTOM UNIFIED TOGGLE BUTTON -------------------- //

const ToggleSwitch = styled.div`
  position: relative;
  width: 240px;
  height: 50px;
  background-color: #44444a;
  border-radius: 999px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  margin: 1.5rem 0;
`;

const ToggleOption = styled.div<{ active: boolean }>`
  flex: 1;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: ${({ active }) => (active ? "#fff" : "#bbb")};
  transition: color 0.3s ease;

  svg {
    stroke: ${({ active }) => (active ? "#fff" : "#bbb")};
    margin-right: 0.5rem;
    transition: stroke 0.3s ease;
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
  transition: left 0.3s ease;
  z-index: 1;
`;

const agentsData = [
  {
    name: "Agent Alpha",
    description: "An advanced AI assistant for handling complex tasks.",
    performance: { speed: "90%", accuracy: "85%" },
  },
  {
    name: "Agent Beta",
    description:
      "A reliable agent for customer support with fast response time.",
    performance: { speed: "80%", accuracy: "90%" },
  },
  {
    name: "Agent Gamma",
    description: "A highly specialized agent for data analysis.",
    performance: { speed: "70%", accuracy: "95%" },
  },
];

const Agents: React.FC = () => {
  // false: List view, true: Graph view.
  const [isDetailView, setIsDetailView] = useState(false);

  const toggleView = () => {
    setIsDetailView((prev) => !prev);
  };

  // Action for Back button; you can integrate with a router as needed.
  const handleBack = () => {
    window.history.back();
  };

  // Action for Dashboard button.
  const goToDashboard = () => {
    window.location.href = "/dashboard";
  };

  return (
    <Container>
      <Header>
        <ControlButton onClick={handleBack}>
          <ArrowLeft size={24} /> Back
        </ControlButton>
        <Title>Available Agents</Title>
        <ControlButton onClick={goToDashboard}>
          <LayoutDashboard size={24} /> Dashboard
        </ControlButton>
      </Header>

      {/* Unified Toggle Button */}
      <ToggleSwitch onClick={toggleView}>
        <SwitchCircle active={isDetailView} />
        <ToggleOption active={!isDetailView}>
          <List size={20} /> List
        </ToggleOption>
        <ToggleOption active={isDetailView}>
          <BarChart size={20} /> Graph
        </ToggleOption>
      </ToggleSwitch>

      <AgentListContainer>
        {agentsData.map((agent, index) => (
          <AgentCard key={index}>
            <AgentTitle>{agent.name}</AgentTitle>
            <AgentDescription>{agent.description}</AgentDescription>
            {isDetailView && (
              <PerformanceMetrics>
                <p>
                  <strong>Speed:</strong> {agent.performance.speed}
                </p>
                <p>
                  <strong>Accuracy:</strong> {agent.performance.accuracy}
                </p>
              </PerformanceMetrics>
            )}
          </AgentCard>
        ))}
      </AgentListContainer>
    </Container>
  );
};

export default Agents;