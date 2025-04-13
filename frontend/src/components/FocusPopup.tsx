import React, { useState, useEffect } from "react";
import styled from "styled-components";

// -------------------- OVERLAY & CONTAINER -------------------- //

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PopupContainer = styled.div`
  position: relative;
  width: 600px;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
`;

// -------------------- SCI-FI CARD & SVG -------------------- //

const AnimatedSVG = styled.svg`
  .circle-element {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;

const SciFiCardSVG = () => {
  const [rotationOffset, setRotationOffset] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      // Calculate rotation offsets
      const rotX = (y / window.innerHeight - 0.5) * -300;
      const rotY = (x / window.innerWidth - 0.5) * 300;
      setRotationOffset({ x: rotX, y: rotY });
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const topArcRotation = `rotate(${rotationOffset.y * 0.5} 300 300)`;
  const bottomArcRotation = `rotate(${rotationOffset.y * -0.5} 300 300)`;
  const shrinkScale = isMouseDown ? "scale(0.75)" : "scale(0.8)";

  return (
    <AnimatedSVG width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="ringGradient" r="1" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#d2c2f0" stopOpacity="0" />
          <stop offset="100%" stopColor="#d2c2f0" stopOpacity="0.3" />
        </radialGradient>
      </defs>

      <g
        className="circle-element"
        transform={`translate(300 300) ${shrinkScale} translate(-300 -300)`}
      >
        <circle
          cx="300"
          cy="300"
          r="285"
          fill="none"
          stroke="#d2c2f0"
          strokeWidth="2"
          strokeDasharray="10 5"
          filter="url(#glow)"
        />
        <circle
          cx="300"
          cy="300"
          r="255"
          fill="none"
          stroke="#d2c2f0"
          strokeWidth="2"
          strokeDasharray="2 4"
        />

        <g transform={topArcRotation}>
          <path
            d="M 90 300 A 210 210 0 0 1 300 90"
            stroke="#d2c2f0"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
          />
        </g>

        <g transform={bottomArcRotation}>
          <path
            d="M 510 300 A 210 210 0 0 1 300 510"
            stroke="#d2c2f0"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
          />
        </g>

        <g
          stroke="#d2c2f0"
          strokeWidth="2"
          transform={`rotate(${
            (rotationOffset.y + rotationOffset.x) * 0.2
          } 300 300)`}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <g key={i} transform={`rotate(${i * 30} 300 300)`}>
              <line x1="300" y1="30" x2="300" y2="45" />
            </g>
          ))}
        </g>
      </g>
    </AnimatedSVG>
  );
};

// -------------------- STATS RADAR CHART COMPONENT -------------------- //

const RadarChartContainer = styled.svg`
  width: 100%;
  height: 200px;
  margin-top: 1rem;
  overflow: visible;
`;

interface StatsRadarChartProps {
  data: {
    label: string;
    value: number;
    maxValue: number;
  }[];
}

const StatsRadarChart: React.FC<StatsRadarChartProps> = ({ data }) => {
  const numAxes = data.length;
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 120;

  // Calculate polygon points for the radar polygon.
  const points = data
    .map((d, i) => {
      const angle = (2 * Math.PI * i) / numAxes;
      const r = (d.value / d.maxValue) * maxRadius;
      const x = centerX + r * Math.sin(angle);
      const y = centerY - r * Math.cos(angle);
      return `${x},${y}`;
    })
    .join(" ");

  // Create concentric rings for reference (25%, 50%, 75%, and 100%).
  const rings = [0.25, 0.5, 0.75, 1].map((scale) => {
    return data
      .map((_, i) => {
        const angle = (2 * Math.PI * i) / numAxes;
        const r = scale * maxRadius;
        const x = centerX + r * Math.sin(angle);
        const y = centerY - r * Math.cos(angle);
        return `${x},${y}`;
      })
      .join(" ");
  });

  return (
    <RadarChartContainer viewBox="0 0 300 300">
      {rings.map((ring, index) => (
        <polygon
          key={index}
          points={ring}
          fill="none"
          stroke="#555"
          strokeWidth="0.5"
        />
      ))}
      {data.map((_, i) => {
        const angle = (2 * Math.PI * i) / numAxes;
        const x = centerX + maxRadius * Math.sin(angle);
        const y = centerY - maxRadius * Math.cos(angle);
        return (
          <line
            key={i}
            x1={centerX}
            y1={centerY}
            x2={x}
            y2={y}
            stroke="#d8b4fe"
            strokeWidth="0.5"
          />
        );
      })}
      <polygon
        points={points}
        fill="rgba(216, 180, 254, 0.4)" // Semi-transparent purple fill
        stroke="#d8b4fe" // Solid purple outline
        strokeWidth="2"
      />
      {data.map((d, i) => {
        const angle = (2 * Math.PI * i) / numAxes;
        const labelRadius = maxRadius + 20;
        const x = centerX + labelRadius * Math.sin(angle);
        const y = centerY - labelRadius * Math.cos(angle);
        return (
          <text
            key={i}
            x={x}
            y={y}
            fill="#ffffff"
            fontSize="12"
            textAnchor="middle"
          >
            {d.label}
          </text>
        );
      })}
    </RadarChartContainer>
  );
};

// -------------------- CARD DETAIL OVERLAY (RIGHT SIDE) -------------------- //

// Positioned on the right side, vertically centered.
const CardDetailOverlay = styled.div`
  position: absolute;
  top: 50%;
  right: 600px;
  transform: translateY(-50%);
  min-width: 300px;
  background-color: #1c1c1e; /* Grayish black */
  border: 1px solid #ffffff; /* White outline */
  border-radius: 8px;
  padding: 1.5rem;
  z-index: 9999;
  text-align: left;
`;

// Title styled with larger light-blue text.
const DetailTitle = styled.h4`
  margin: 0 0 0.75rem;
  font-size: 1.5rem; /* Larger font size */
  color: #d8b4fe; /* Light blue */
  font-weight: 600;
  white-space: nowrap;
`;

// Individual stat items.
const StatItem = styled.div`
  font-size: 1.2rem; /* Increased font size */
  color: #fff;
  margin: 0.5rem 0;
`;

// -------------------- SCI-FI TAG CARD -------------------- //

const SciFiTagCard = styled.div`
  position: relative;
  width: 600px;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;

  & > svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`;

// -------------------- HELPER FUNCTION TO GENERATE RANDOM DATA -------------------- //

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// -------------------- MAIN POPUP COMPONENT -------------------- //

const Popup = () => {
  // State for randomized radar data.
  const [radarData, setRadarData] = useState<
    { label: string; value: number; maxValue: number }[]
  >([]);

  useEffect(() => {
    // Generate random data for each stat on mount.
    setRadarData([
      { label: "Relations", value: getRandomInt(300, 500), maxValue: 500 },
      { label: "Uptime", value: getRandomInt(80, 100), maxValue: 100 },
      { label: "Response", value: getRandomInt(50, 100), maxValue: 100 },
      { label: "Latency", value: getRandomInt(10, 50), maxValue: 100 },
    ]);
  }, []);

  return (
    <Overlay>
      <PopupContainer>
        <SciFiTagCard>
          <SciFiCardSVG />
          {/* Right-side stats overlay */}
          <CardDetailOverlay>
            <DetailTitle>OpenAI Agent</DetailTitle>
            <StatItem>ID: 0xf66910ab</StatItem>
            <StatItem>Relations: {radarData[0]?.value || "..."}</StatItem>
            <StatItem>Uptime: {radarData[1]?.value || "..."}%</StatItem>
            <StatItem>Response: {radarData[2]?.value || "..."}ms</StatItem>
            <StatItem>Latency: {radarData[3]?.value || "..."}ms</StatItem>
            {/* Radar chart displaying the stats */}
            <StatsRadarChart data={radarData} />
          </CardDetailOverlay>
        </SciFiTagCard>
      </PopupContainer>
    </Overlay>
  );
};

export default Popup;
