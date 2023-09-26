import React, { useRef, useEffect, useState } from "react";

const SmoothLineAnimation = ({ coordinates }) => {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const animationDuration = 2000; // Animation duration in milliseconds

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const drawLine = (start, end, progress) => {
      const x = start.lng + (end.lng - start.lng) * progress;
      const y = start.lat + (end.lat - start.lat) * progress;
      return { x, y };
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < coordinates.length - 1; i++) {
        const start = coordinates[i];
        const end = coordinates[i + 1];
        const interpolatedPoint = drawLine(start, end, progress);

        ctx.beginPath();
        ctx.arc(interpolatedPoint.x, interpolatedPoint.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.closePath();
      }

      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1 / (animationDuration / 16); // 16ms per frame for 60fps
        if (newProgress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        }
        return newProgress;
      });
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [coordinates]);

  return <canvas ref={canvasRef}></canvas>;
};

export default SmoothLineAnimation;
