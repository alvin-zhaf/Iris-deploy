import React from "react";
import styled, { keyframes } from "styled-components";

import { BarChart, LineChart, PieChart, AreaChart } from "lucide-react";
import FocusGraph3D from "../components/viz/FocusGraph3D";

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
  padding: 0.75rem 2rem;
  background: rgba(25, 25, 25, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(127, 86, 217, 0.3);
  border-radius: 50px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.7);
  z-index: 999;
  transition: box-shadow 0.3s ease, border 0.3s ease;
  width: 35%;

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
 * IconItem is a 64x64 container that centers the larger icon.
 * It features a circular highlight that fades in on hover,
 * and the icon's stroke color transitions from white to another color when hovered or clicked.
 */
const IconItem = styled.div`
  position: relative;
  margin: 0 1.5rem;
  cursor: pointer;
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;


  /* Circular highlight behind the icon */
  &::before {
    content: "";
    position: absolute;
    width: 64px;
    height: 64px;
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
            <BarChart size={50} color="#000" />
          </IconItem>
          <IconItem>
            <LineChart size={50} />
          </IconItem>
          <IconItem>
            <PieChart size={50} />
          </IconItem>
          <IconItem>
            <AreaChart size={50} />
          </IconItem>
        </IconsWrapper>
      </FloatingNavBar>
      {/* Future dashboard content can go here */}
    </DashboardContainer>
  );
};

export default Dashboard;