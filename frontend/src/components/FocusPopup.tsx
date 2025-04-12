import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AnimatedSVG = styled.svg`
  .circle-element {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); /* Smooth easing animation */
  }
`;

const SciFiCardSVG = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [rotationOffset, setRotationOffset] = useState({ x: 0, y: 0 });
    const [isMouseDown, setIsMouseDown] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX;
            const y = e.clientY;

            const rotX = ((y / window.innerHeight) - 0.5) * -300;
            const rotY = ((x / window.innerWidth) - 0.5) * 300;

            setMousePos({ x, y });
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
        }
    }, []);

    const topArcRotation = `rotate(${rotationOffset.y * 0.5} 200 200)`;
    const bottomArcRotation = `rotate(${rotationOffset.y * -0.5} 200 200)`;

    const shrinkScale = isMouseDown ? "scale(0.95)" : "scale(1)";

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

            <g className="circle-element" transform={`translate(200 200) ${shrinkScale} translate(-200 -200)`}>
                <circle
                    cx="200"
                    cy="200"
                    r="190"
                    fill="none"
                    stroke="#d2c2f0"
                    strokeWidth="1"
                    strokeDasharray="10 5"
                    filter="url(#glow)"
                />
                <circle
                    cx="200"
                    cy="200"
                    r="170"
                    fill="none"
                    stroke="#d2c2f0"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                />

                <g transform={topArcRotation}>
                    <path
                        d="M 60 200 A 140 140 0 0 1 200 60"
                        stroke="#d2c2f0"
                        strokeWidth="1"
                        fill="none"
                        filter="url(#glow)"
                    />
                </g>

                <g transform={bottomArcRotation}>
                    <path
                        d="M 340 200 A 140 140 0 0 1 200 340"
                        stroke="#d2c2f0"
                        strokeWidth="1"
                        fill="none"
                        filter="url(#glow)"
                    />
                </g>

                <g
                    stroke="#d2c2f0"
                    strokeWidth="1"
                    transform={`rotate(${(rotationOffset.y + rotationOffset.x) * 0.2} 200 200)`}
                >
                    {Array.from({ length: 12 }).map((_, i) => (
                        <g key={i} transform={`rotate(${i * 30} 200 200)`}>
                            <line x1="200" y1="20" x2="200" y2="30" />
                        </g>
                    ))}
                </g>
            </g>
        </AnimatedSVG>
    );
};

const PopupContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
`;

const SciFiTagCard = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
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

const Popup = () => {
    return (
        <Overlay>
            <PopupContainer>
                <SciFiTagCard>
                    <SciFiCardSVG />
                </SciFiTagCard>
            </PopupContainer>
        </Overlay>
    );
};

export default Popup;
