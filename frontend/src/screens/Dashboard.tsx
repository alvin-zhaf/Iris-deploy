import React from 'react';
import styled from 'styled-components';
import { BarChart, LineChart, PieChart, AreaChart } from 'lucide-react';

// Container for the whole dashboard with a dotted background.
const DashboardContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #0f0f0f;
  background-image: radial-gradient(circle, #1a1a1a 1px, transparent 1px);
  background-size: 20px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

// Main card for dashboard content.
const DashboardCard = styled.div`
  background: linear-gradient(145deg, #1d1d1d, #222);
  border-radius: 15px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  color: #fff;
  text-align: center;
`;

// Header styling for the dashboard.
const Header = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  letter-spacing: 2px;
`;

// Container for the icons.
const IconsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 2rem;
`;

// Individual icon container with a hover effect.
const IconBox = styled.div`
  background: #292929;
  padding: 1rem;
  border-radius: 10px;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
  svg {
    width: 40px;
    height: 40px;
    stroke: #7f56d9;
  }
`;

// Main Dashboard functional component.
const Dashboard: React.FC = () => {
  return (
    <DashboardContainer>
      <DashboardCard>
        <Header>Futuristic Dashboard</Header>
        <p>Your data visualization starts here.</p>
        <IconsWrapper>
          <IconBox>
            <BarChart />
          </IconBox>
          <IconBox>
            <LineChart />
          </IconBox>
          <IconBox>
            <PieChart />
          </IconBox>
          <IconBox>
            <AreaChart />
          </IconBox>
        </IconsWrapper>
      </DashboardCard>
    </DashboardContainer>
  );
};

export default Dashboard;