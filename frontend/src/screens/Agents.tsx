import React, { useState } from "react";
import styled from "styled-components";

// Basic styling for the page
const Container = styled.div`
  background-color: #18181b;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
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

const ToggleButton = styled.button`
  background-color: #7f56d9;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #9b66ff;
  }

  &:active {
    transform: scale(0.98);
  }
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
  const [isDetailView, setIsDetailView] = useState(false);

  const toggleView = () => {
    setIsDetailView(!isDetailView);
  };

  return (
    <Container>
      <h1>Available Agents</h1>
      <ToggleButton onClick={toggleView}>
        {isDetailView ? "Switch to List View" : "Switch to Detail View"}
      </ToggleButton>

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
