import React, { useEffect, useRef } from 'react';

interface Waypoint {
  x: number;
  y: number;
  label?: string;
}

interface TacticalMapProps {
  waypoints?: Waypoint[];
  scanning?: boolean;
}

const TacticalMap: React.FC<TacticalMapProps> = ({ waypoints = [], scanning = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle High DPI screens
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let animationFrameId: number;
    let radarAngle = 0;

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(45, 68, 45, 0.3)';
      ctx.lineWidth = 1;
      const step = 40;
      
      // Vertical lines
      for (let x = 0; x <= rect.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rect.height);
        ctx.stroke();
        
        // Coordinates text
        if (x % 80 === 0) {
          ctx.fillStyle = 'rgba(45, 68, 45, 0.8)';
          ctx.font = '10px monospace';
          ctx.fillText(`${x}`, x + 2, 10);
        }
      }
      
      // Horizontal lines
      for (let y = 0; y <= rect.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }
    };

    const drawTerrain = () => {
        // Simulated terrain contour lines
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.1)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, rect.height * 0.6);
        ctx.bezierCurveTo(rect.width * 0.3, rect.height * 0.4, rect.width * 0.6, rect.height * 0.8, rect.width, rect.height * 0.5);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, rect.height * 0.8);
        ctx.bezierCurveTo(rect.width * 0.4, rect.height * 0.9, rect.width * 0.7, rect.height * 0.6, rect.width, rect.height * 0.9);
        ctx.stroke();
    }

    const drawRadar = () => {
      if (!scanning && waypoints.length > 0) return; // Stop scanning if route is found

      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const radius = Math.max(rect.width, rect.height);

      // Radar sweep gradient
      const gradient = ctx.createConicGradient(radarAngle, cx, cy);
      gradient.addColorStop(0, 'rgba(74, 222, 128, 0)');
      gradient.addColorStop(0.8, 'rgba(74, 222, 128, 0)');
      gradient.addColorStop(1, 'rgba(74, 222, 128, 0.2)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Scanning line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(radarAngle) * radius, cy + Math.sin(radarAngle) * radius);
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      radarAngle += 0.02;
    };

    const drawRoute = () => {
      if (!waypoints || waypoints.length === 0) return;

      ctx.strokeStyle = '#4ade80'; // military-500
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();

      waypoints.forEach((wp, index) => {
        // Scale 0-100 coordinate to canvas size
        const x = (wp.x / 100) * rect.width;
        const y = (wp.y / 100) * rect.height;

        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Points
      waypoints.forEach((wp, index) => {
        const x = (wp.x / 100) * rect.width;
        const y = (wp.y / 100) * rect.height;
        
        // Dot
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = index === 0 || index === waypoints.length - 1 ? '#ef4444' : '#eab308';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.stroke();

        // Label
        if (wp.label) {
          ctx.fillStyle = '#4ade80';
          ctx.font = 'bold 12px monospace';
          ctx.fillText(wp.label, x + 10, y + 4);
        }
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      // Background fill
      ctx.fillStyle = '#0a0f0a';
      ctx.fillRect(0, 0, rect.width, rect.height);

      drawGrid();
      drawTerrain();
      drawRoute();
      drawRadar();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [waypoints, scanning]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full block"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default TacticalMap;