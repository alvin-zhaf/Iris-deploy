import { useRef, useEffect, useState } from "react";

export default function DeformCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element is not available.");
      return;
    }

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("2D context is not available.");
      return;
    }

    let mouseX = 0;
    let mouseY = 0;

    // Use document-level mouse tracking instead of canvas-specific
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener("mousemove", handleMouseMove);

    function draw() {
      // These non-null assertions are safe because we've checked both canvas and ctx above
      const range = 100;
      const intensity = 5;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (let x = 0; x < canvas!.width; x += 20) {
        for (let y = 0; y < canvas!.height; y += 20) {
          const dx = mouseX - x;
          const dy = mouseY - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const falloff = 1 / (distance / range + 1);
          const angle = Math.atan2(dy, dx);
          const move = -falloff * intensity;

          ctx!.beginPath();
          ctx!.arc(
            x + Math.cos(angle) * move,
            y + Math.sin(angle) * move,
            falloff ** 0.3 * 4,
            0,
            Math.PI * 2
          );
          ctx!.fillStyle = `rgba(255, 255, 255, ${0.5 * falloff ** 2})`;
          ctx!.fill();
        }
      }
      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [dimensions]);

  return <canvas className="absolute inset-0 w-full h-full bg" ref={canvasRef} />;
}