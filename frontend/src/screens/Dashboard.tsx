import React from "react";
import styled from "styled-components";
import { BarChart, LineChart, PieChart, AreaChart } from "lucide-react";
import FocusGraph3D from "../components/viz/FocusGraph3D";

// Container for the whole page with a dotted background.
const DashboardContainer = styled.div`
  position: absolute; /* Make the container absolutely positioned */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #0f0f0f;
  background-image: radial-gradient(circle, #1a1a1a 1px, transparent 1px);
  background-size: 20px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align items to the top */
  padding: 2rem;
`;

// Container for the icons at the top of the page.
const IconsWrapper = styled.div`
  display: flex;
  justify-content: center; /* Center icons horizontally */
  align-items: center;
  width: 100%;
  margin-top: 1rem; /* Add a little space from the top */
`;

// Main Dashboard functional component (with only icons).
const Dashboard: React.FC = () => {
  return (
    <DashboardContainer>
      <IconsWrapper>
        <BarChart size={40} color="#7f56d9" style={{ margin: "0  2rem" }} />
        <LineChart size={40} color="#7f56d9" style={{ margin: "0 2rem" }} />
        <PieChart size={40} color="#7f56d9" style={{ margin: "0 2rem" }} />
        <AreaChart size={40} color="#7f56d9" style={{ margin: "0 2rem" }} />
      </IconsWrapper>
      <FocusGraph3D />
    </DashboardContainer>
  );
};

export default Dashboard;
