import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------------------
// Layout Container
// ----------------------------------------------------------
const DashboardContainer = styled.div`
  display: flex;
  width: 100vw;
  min-height: 100vh;
  background-color: #0f0f0f;
  background-image: radial-gradient(circle, #1a1a1a 1px, transparent 1px);
  background-size: 20px 20px;
`;

// ----------------------------------------------------------
// Sidebar Styling (Expandable)
// ----------------------------------------------------------
interface SidebarProps {
  expanded: boolean;
}

const Sidebar = styled.div<SidebarProps>`
  width: ${(props) => (props.expanded ? "240px" : "80px")};
  background: rgba(25, 25, 25, 0.95);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(127, 86, 217, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  transition: width 0.3s ease;
`;

// Branding area with logo and text
const Branding = styled.div<SidebarProps>`
  display: flex;
  align-self: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 2rem;
  
  img {
    width: 40px;
    height: 40px;
  }
  
  span {
    margin-left: ${(props) => (props.expanded ? "0.5rem" : "0")};
    margin-top: ${(props) => (props.expanded ? "0.2rem" : "0")};
    font-size: 1.5rem;
    font-weight: 600;
    white-space: nowrap;
    display: ${(props) => (props.expanded ? "block" : "none")};
    line-height: 40px; /* Align text vertically with the 40px logo */
  }
    font-family: "kugile", sans-serif;
`;

// Container for the icons with labels
const IconsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  align-items: center;
`;

// Individual icon item (centered)
const IconItem = styled.div<SidebarProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(127, 86, 217, 0.15);
  }
  
  svg {
    stroke: #fff;
    transition: stroke 0.2s ease;
  }
`;

// Label next to the icon when expanded
const IconLabel = styled.span`
  margin-left: 0.5rem;
  font-size: 1rem;
  white-space: nowrap;
`;

// Sidebar Exit Button styling using a distinct exit icon (LogOut)
const ExitButton = styled.button<SidebarProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => (props.expanded ? "100%" : "40px")};
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-top: 2rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: #a288f4;
  }
  
  span {
    margin-left: 0.5rem;
    white-space: nowrap;
    display: ${(props) => (props.expanded ? "inline" : "none")};
  }
`;

// Toggle button container at the bottom of the sidebar
const ToggleContainer = styled.div<SidebarProps>`
  margin-top: auto;
  width: 100%;
  display: flex;
  justify-content: center;
  cursor: pointer;
  padding: 0.5rem;
`;

// ----------------------------------------------------------
// Main Content Area (to the right of the Sidebar)
// ----------------------------------------------------------
interface ContentAreaProps {
  expanded: boolean;
}

const ContentArea = styled.div<ContentAreaProps>`
  margin-left: ${(props) => (props.expanded ? "260px" : "100px")};
  padding: 2rem;
  flex-grow: 1;
  color: #fff;
  transition: margin-left 0.3s ease;
`;

// ----------------------------------------------------------
// Content Panel Animations
// ----------------------------------------------------------
const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const ContentPanel = styled.div`
  background-color: #1a1a1a;
  border: 1px solid rgba(127, 86, 217, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

// ----------------------------------------------------------
// Workflow (GitHub Actions–Style) Content
// ----------------------------------------------------------
const dummyWorkflows = [
  {
    id: "KPD-136",
    title: "Add text block with background",
    detail: "CI #227: Pull request #236 by fsylum",
    status: "success"
  },
  {
    id: "KAP-23",
    title: "Initial code for the hero full width block",
    detail: "CI #242 ready_for_review by ridimova",
    status: "inProgress"
  },
  {
    id: "KPD-141",
    title: "Main navigation",
    detail: "CI #225 synchronize by joleenk",
    status: "failure"
  }
];

const WorkflowHeadingBanner = styled.div`
  background-color: rgba(127, 86, 217, 0.15);
  border: 1px solid rgba(127, 86, 217, 0.5);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  text-align: center;
`;

const WorkflowList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const WorkflowItem = styled.li`
  display: flex;
  align-items: center;
  background: rgba(25, 25, 25, 0.75);
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid rgba(127, 86, 217, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: rgba(25, 25, 25, 0.9);
  }
`;

const StatusCircle = styled.div<{ status: string }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: 1rem;
  flex-shrink: 0;
  background-color: ${(props) => {
    switch (props.status) {
      case "success":
        return "#28a745";
      case "inProgress":
        return "#ffa500";
      case "failure":
        return "#dc3545";
      default:
        return "#aaa";
    }
  }};
`;

const WorkflowText = styled.div`
  display: flex;
  flex-direction: column;
`;

const WorkflowTitle = styled.span`
  font-weight: bold;
`;

const WorkflowDetail = styled.span`
  font-size: 0.9rem;
  color: #ccc;
`;

const WorkflowPanel: React.FC = () => {
  return (
    <ContentPanel>
      <WorkflowHeadingBanner>
        This workflow has a <strong>workflow_dispatch</strong> event trigger
      </WorkflowHeadingBanner>
      <WorkflowList>
        {dummyWorkflows.map((wf, index) => (
          <WorkflowItem key={index}>
            <StatusCircle status={wf.status} />
            <WorkflowText>
              <WorkflowTitle>{`${wf.id} - ${wf.title}`}</WorkflowTitle>
              <WorkflowDetail>{wf.detail}</WorkflowDetail>
            </WorkflowText>
          </WorkflowItem>
        ))}
      </WorkflowList>
    </ContentPanel>
  );
};

// ----------------------------------------------------------
// Placeholder Panel for Other Icons
// ----------------------------------------------------------
const InfoPanel: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <ContentPanel>
    <h2>{title}</h2>
    <p>{content}</p>
  </ContentPanel>
);

// ----------------------------------------------------------
// Main Dashboard Component (with Expandable Sidebar, Exit Button & Inline Content Panels)
// ----------------------------------------------------------
const Dashboard: React.FC = () => {
  // Track which content panel is active
  const [activePanel, setActivePanel] = useState<"workflow" | "line" | "pie" | "area" | null>(null);
  // Toggle state of sidebar (expanded/collapsed)
  const [isSidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <DashboardContainer>
      <Sidebar expanded={isSidebarExpanded}>
        {/* Branding */}
        <Branding expanded={isSidebarExpanded}>
          <img src="logo.svg" alt="Logo" />
          <span>Iris</span>
        </Branding>

        {/* Icons */}
        <IconsWrapper>
          <IconItem expanded={isSidebarExpanded} onClick={() => setActivePanel("workflow")}>
            <BarChart size={30} />
            {isSidebarExpanded && <IconLabel>Workflow</IconLabel>}
          </IconItem>
          <IconItem expanded={isSidebarExpanded} onClick={() => setActivePanel("line")}>
            <LineChart size={30} />
            {isSidebarExpanded && <IconLabel>Line Chart</IconLabel>}
          </IconItem>
          <IconItem expanded={isSidebarExpanded} onClick={() => setActivePanel("pie")}>
            <PieChart size={30} />
            {isSidebarExpanded && <IconLabel>Pie Chart</IconLabel>}
          </IconItem>
          <IconItem expanded={isSidebarExpanded} onClick={() => setActivePanel("area")}>
            <AreaChart size={30} />
            {isSidebarExpanded && <IconLabel>Area Chart</IconLabel>}
          </IconItem>
        </IconsWrapper>

        {/* Exit Button */}
        <ExitButton
          expanded={isSidebarExpanded}
          onClick={() => navigate("/")}
        >
          <LogOut size={20} />
          <span>Exit</span>
        </ExitButton>

        {/* Toggle Button */}
        <ToggleContainer expanded={isSidebarExpanded} onClick={() => setSidebarExpanded(prev => !prev)}>
          {isSidebarExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </ToggleContainer>
      </Sidebar>

      <ContentArea expanded={isSidebarExpanded}>
        {activePanel === "workflow" && <WorkflowPanel />}
        {activePanel === "line" && (
          <InfoPanel
            title="Line Chart Details"
            content="This section provides details and settings for the Line Chart."
          />
        )}
        {activePanel === "pie" && (
          <InfoPanel
            title="Pie Chart Details"
            content="This section provides details and settings for the Pie Chart."
          />
        )}
        {activePanel === "area" && (
          <InfoPanel
            title="Area Chart Details"
            content="This section provides details and settings for the Area Chart."
          />
        )}
      </ContentArea>
    </DashboardContainer>
  );
};

export default Dashboard;
