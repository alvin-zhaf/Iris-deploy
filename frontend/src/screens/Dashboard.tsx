import React from "react";
import styled, { keyframes } from "styled-components";
import { BarChart, LineChart, PieChart, AreaChart } from "lucide-react";

// Container for the whole page with a dotted background.
const DashboardContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #0f0f0f;
  background-image: radial-gradient(circle, #1a1a1a 1px, transparent 1px);
  background-size: 20px 20px;
`;

// Floating, detached NavBar with a frosted glass effect,
// using a background that blends with the overall theme.
const FloatingNavBar = styled.nav`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1.5rem; /* Reduced padding */
  background: rgba(25, 25, 25, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(127, 86, 217, 0.3);
  border-radius: 50px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.7);
  z-index: 999;
  transition: box-shadow 0.3s ease, border 0.3s ease;
  width: 25%; /* Reduced width */
  text-align: center;

  &:hover {
    box-shadow: 0px 6px 30px rgba(127, 86, 217, 0.4);
    border: 1px solid rgba(127, 86, 217, 0.6);
  }
`;

// Container for the icons inside the floating navbar.
const IconsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: space-between;
`;

/**
 * IconItem is a 50x50 container that centers the larger icon.
 * It features a circular highlight that fades in on hover,
 * and the icon's stroke color transitions from white to another color when hovered or clicked.
 */
const IconItem = styled.div`
  position: relative;
  margin: 0 1rem; /* Reduced margin */
  cursor: pointer;
  width: 50px; /* Reduced width */
  height: 50px; /* Reduced height */
  display: flex;
  justify-content: center;
  align-items: center;

  /* Circular highlight behind the icon */
  &::before {
    content: "";
    position: absolute;
    width: 50px; /* Adjusted size */
    height: 50px; /* Adjusted size */
    border-radius: 50%;
    background-color: #7f56d9;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover::before {
    opacity: 0.15;
  }

  svg {
    stroke: #fff;
    transition: stroke 0.2s ease;
  }

  &:hover svg {
    stroke: #a288f4;
  }

  &:active svg {
    stroke: #ff4081; /* Accent color on click */
  }
`;

const Dashboard: React.FC = () => {
  return (
    <DashboardContainer>
      <FloatingNavBar>
        <IconsWrapper>
          <IconItem>
            <BarChart size={30} color="#000" /> {/* Reduced size */}
          </IconItem>
          <IconItem>
            <LineChart size={30} /> {/* Reduced size */}
          </IconItem>
          <IconItem>
            <PieChart size={30} /> {/* Reduced size */}
          </IconItem>
          <IconItem>
            <AreaChart size={30} /> {/* Reduced size */}
          </IconItem>
        </IconsWrapper>
      </FloatingNavBar>
      {/* Future dashboard content can go here */}
    </DashboardContainer>
  );
};

export default Dashboard;
