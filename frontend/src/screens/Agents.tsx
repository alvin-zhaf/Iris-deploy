import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { BarChart, List, ArrowLeft, Home, Plus, X } from "lucide-react";
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
  gap: 1.5rem; /* Increased spacing between cards */
  padding-bottom: 2rem; /* Add some bottom padding */
`;

const AgentCard = styled.div<{ isExpanded: boolean }>`
  background-color: #27272a;
  border-radius: 10px;
  border: 2px solid transparent;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem 1.5rem 0 1.5rem; /* Remove bottom padding */
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative; /* For absolute positioning of the sparkline */
  overflow: hidden; /* To keep the sparkline within the border radius */
  aspect-ratio: 1/1; /* Make the card perfectly square */

  &:hover {
    transform: scale(1.05);
    border: 2px solid #d8b4fe; /* Pink border highlight on hover */
  }

  transform: ${(props) =>
    props.isExpanded ? "scale(1.05)" : "scale(1)"}; /* Scale on click */
`;

// New card for creating an agent
const CreateAgentCard = styled.div`
  background-color: #27272a;
  border-radius: 10px;
  border: 2px dotted rgba(127, 86, 217, 0.5);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem 1.5rem 0 1.5rem; /* Match AgentCard padding */
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease;
  aspect-ratio: 1/1; /* Make the card perfectly square */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative; /* For consistency with AgentCard */
  overflow: hidden; /* For consistency with AgentCard */

  &:hover {
    transform: scale(1.05);
    border: 2px dotted #d8b4fe;
  }
`;

const PlusIconContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(127, 86, 217, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const CreateAgentText = styled.p`
  color: #d8b4fe;
  font-size: 1.1rem;
  margin: 0;
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

const SparklineContainer = styled.div`
  position: absolute;
  bottom: 0; /* Start from the bottom */
  left: 0;
  right: 0;
  height: 50%; /* Take exactly half the card height */
  width: 100%;
`;

// -------------------- DIALOG STYLES -------------------- //

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  animation: ${fadeIn} 0.3s ease;
`;

const DialogContent = styled.div`
  background: #27272a;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.4s ease;
`;

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const DialogTitle = styled.h2`
  color: #d8b4fe;
  margin: 0;
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #fff;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: #3f3f46;
  border: 1px solid #52525b;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: #fff;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #7f56d9;
  }
`;

const TextArea = styled.textarea`
  background: #3f3f46;
  border: 1px solid #52525b;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: #fff;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #7f56d9;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  background: transparent;
  border: 1px solid #52525b;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;

  &:hover {
    background: #3f3f46;
  }
`;

const SubmitButton = styled.button`
  background: #7f56d9;
  border: none;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;

  &:hover {
    background: #6941c6;
  }
`;

// -------------------- FULL-PAGE GRAPH OVERLAY -------------------- //

const GraphOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at bottom,rgb(51, 42, 59) 0%, #090a0f 100%);
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

// -------------------- SPARKLINE COMPONENT -------------------- //

// Simple sparkline implementation since we're not importing MUI Sparkline
const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  // Create SVG path for the area chart
  const width = 100;
  const height = 100; // Using 100 for easier percentage calculations
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  // Create path points - position in the top part of the bottom half
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    // Position the chart line at about 40-45% from the top of the SVG (in the upper portion of bottom half)
    const y = (height * 0.4) + ((value - min) / range) * (height * 0.1);
    return `${x},${y}`;
  });
  
  // Create separate paths - one for fill with gradient and one for stroke
  const fillPathD = `M0,${height} L0,${points[0].split(',')[1]} L${points.join(' L')} L${width},${points[points.length-1].split(',')[1]} L${width},${height} Z`;
  const strokePathD = `M${points.join(' L')}`;
  
  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox={`0 0 ${width} ${height}`} 
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="40%" stopColor={color} stopOpacity="0.5" />
          <stop offset="70%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={fillPathD}  
        fill={`url(#gradient-${color.replace('#', '')})`}
        stroke="none"
      />
      <path
        d={strokePathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
};

// -------------------- MOCK DATA -------------------- //

const agentsData = [
  {
    name: "Agent Alpha",
    owner: "John Doe",
    description: "An advanced AI assistant for handling complex tasks.",
    timeCreated: "2023-01-15",
    freqUsed: "1500 times",
    performance: { speed: "90%", accuracy: "85%" },
    sparklineData: [10, 15, 13, 17, 12, 14, 18, 15, 20, 18, 22],
    sparklineColor: "#7f56d9"
  },
  {
    name: "Agent Beta",
    owner: "Jane Smith",
    description:
      "A reliable agent for customer support with fast response time.",
    timeCreated: "2023-02-20",
    freqUsed: "1000 times",
    performance: { speed: "80%", accuracy: "90%" },
    sparklineData: [5, 8, 12, 10, 14, 16, 13, 15, 18, 19, 17],
    sparklineColor: "#7f56d9"
  },
  {
    name: "Agent Gamma",
    owner: "Michael Lee",
    description: "A highly specialized agent for data analysis.",
    timeCreated: "2023-03-10",
    freqUsed: "1200 times",
    performance: { speed: "70%", accuracy: "95%" },
    sparklineData: [8, 10, 12, 14, 12, 16, 15, 17, 19, 20, 22],
    sparklineColor: "#7f56d9"
  },
];

// -------------------- SUCCESS NOTIFICATION -------------------- //

const fadeInOut = keyframes`
  0% { opacity: 0; transform: translateX(20px); }
  10% { opacity: 1; transform: translateX(0); }
  90% { opacity: 1; transform: translateX(0); }
  100% { opacity: 0; transform: translateX(20px); }
`;

const SuccessNotification = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #7f56d9;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${fadeInOut} 3s ease forwards;
`;

// -------------------- MAIN COMPONENT -------------------- //

const Agents: React.FC = () => {
  // false: List view, true: Graph (3D universe) view.
  const [isDetailView, setIsDetailView] = useState(false);
  // Track which agent card is expanded
  const [expandedAgentIndex, setExpandedAgentIndex] = useState<number | null>(
    null
  );
  // State for the new agent dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentDescription, setNewAgentDescription] = useState("");
  // State for success notification
  const [showSuccess, setShowSuccess] = useState(false);

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

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    // Reset form fields when closing
    setNewAgentName("");
    setNewAgentDescription("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically add the new agent to your state or send to an API
    console.log("Creating new agent:", { name: newAgentName, description: newAgentDescription });
    
    // Close the dialog
    closeDialog();
    
    // Show success notification
    setShowSuccess(true);
    
    // Auto-hide success notification after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
    
    // In a real implementation, you'd add the new agent to your list
    // and potentially navigate to a creation/configuration page
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
          {/* Create Agent Card */}
          <CreateAgentCard onClick={openDialog}>
            <PlusIconContainer>
              <Plus size={30} color="#d8b4fe" />
            </PlusIconContainer>
            <CreateAgentText>Create New Agent</CreateAgentText>
          </CreateAgentCard>
          
          {/* Existing Agent Cards */}
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
              <SparklineContainer>
                <Sparkline 
                  data={agent.sparklineData} 
                  color={agent.sparklineColor} 
                />
              </SparklineContainer>
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

      {/* Dialog for creating a new agent */}
      {isDialogOpen && (
        <DialogOverlay>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
              <CloseButton onClick={closeDialog}>
                <X size={24} />
              </CloseButton>
            </DialogHeader>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="agentName">Agent Name</Label>
                <Input
                  id="agentName"
                  type="text"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="Enter agent name"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="agentDescription">Description</Label>
                <TextArea
                  id="agentDescription"
                  value={newAgentDescription}
                  onChange={(e) => setNewAgentDescription(e.target.value)}
                  placeholder="Describe what this agent does"
                  required
                />
              </FormGroup>
              <ButtonContainer>
                <CancelButton type="button" onClick={closeDialog}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  Create Agent
                </SubmitButton>
              </ButtonContainer>
            </Form>
          </DialogContent>
        </DialogOverlay>
      )}

      {/* Success notification */}
      {showSuccess && (
        <SuccessNotification>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="white"/>
          </svg>
          Agent created successfully!
        </SuccessNotification>
      )}
    </Container>
  );
};

export default Agents;