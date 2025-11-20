import React, { useEffect, useRef, useState } from 'react';

interface Waypoint {
  x: number;
  y: number;
  label?: string;
}

interface TacticalMapProps {
  waypoints?: Waypoint[];
  scanning?: boolean;
  onMapClick?: (coords: {x: number, y: number}) => void;
}

const TacticalMap: React.FC<TacticalMapProps> = ({ waypoints = [], scanning = true, onMapClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef<number | null>(null);
  // Store the user click position for animation
  const [target, setTarget] = useState<{x: number, y: number, anim: number} | null>(null);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onMapClick || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setTarget({ x, y, anim: 1.0 });
    onMapClick({ x, y });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let animationFrameId: number;
    let radarAngle = 0;

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(45, 68, 45, 0.2)';
      ctx.lineWidth = 1;
      const step = 50;
      
      // Grid
      for (let x = 0; x <= rect.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rect.height);
        ctx.stroke();
        
        // Crosshairs at intersections
        for (let y = 0; y <= rect.height; y += step) {
            ctx.save();
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x - 2, y);
            ctx.lineTo(x + 2, y);
            ctx.moveTo(x, y - 2);
            ctx.lineTo(x, y + 2);
            ctx.stroke();
            ctx.restore();
        }

        // Coord numbers
        if (x % 100 === 0) {
          ctx.fillStyle = 'rgba(45, 68, 45, 0.8)';
          ctx.font = '9px "Share Tech Mono"';
          ctx.fillText(`E-${x/10}`, x + 4, 12);
        }
      }
      
      for (let y = 0; y <= rect.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }
    };

    const drawRouteAndUnit = (timestamp: number) => {
      if (!waypoints || waypoints.length === 0) return;

      // Dotted path
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.2)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      waypoints.forEach((wp, index) => {
        const x = (wp.x / 100) * rect.width;
        const y = (wp.y / 100) * rect.height;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Unit Animation
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const durationPerSegment = 1200;
      const totalSegments = waypoints.length - 1;
      const totalDuration = totalSegments * durationPerSegment;
      
      const elapsed = (timestamp - startTimeRef.current) % (totalDuration + 1500); 
      let currentSegment = Math.floor(elapsed / durationPerSegment);
      if (currentSegment >= totalSegments) currentSegment = totalSegments - 1;
      const segmentProgress = Math.min(1, (elapsed % durationPerSegment) / durationPerSegment);

      // Draw solid traveled path
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#4ade80';
      ctx.beginPath();
      if (elapsed < totalDuration) {
        for (let i = 0; i <= currentSegment; i++) {
          const p1 = waypoints[i];
          const p2 = waypoints[i+1];
          if (!p2) break;
          const x1 = (p1.x / 100) * rect.width;
          const y1 = (p1.y / 100) * rect.height;
          ctx.moveTo(x1, y1);
          
          if (i === currentSegment) {
            const x2 = (p2.x / 100) * rect.width;
            const y2 = (p2.y / 100) * rect.height;
            const cx = x1 + (x2 - x1) * segmentProgress;
            const cy = y1 + (y2 - y1) * segmentProgress;
            ctx.lineTo(cx, cy);

            // Unit Marker
            ctx.save();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.moveTo(cx, cy - 6);
            ctx.lineTo(cx + 5, cy + 5);
            ctx.lineTo(cx - 5, cy + 5);
            ctx.fill();
            ctx.restore();
          } else {
            const x2 = (p2.x / 100) * rect.width;
            const y2 = (p2.y / 100) * rect.height;
            ctx.lineTo(x2, y2);
          }
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Draw Waypoints
      waypoints.forEach((wp, index) => {
        const x = (wp.x / 100) * rect.width;
        const y = (wp.y / 100) * rect.height;
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.rect(x-3, y-3, 6, 6);
        ctx.fill();
        
        ctx.strokeStyle = index === 0 ? '#fff' : (index === waypoints.length - 1 ? '#ef4444' : '#eab308');
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x-3, y-3, 6, 6);

        if (wp.label) {
          ctx.fillStyle = '#4ade80';
          ctx.font = 'bold 10px "Share Tech Mono"';
          ctx.fillText(wp.label, x + 8, y + 4);
        }
      });
    };

    const render = (timestamp: number) => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      // Deep bg
      ctx.fillStyle = '#050a05';
      ctx.fillRect(0, 0, rect.width, rect.height);

      drawGrid();
      
      if (waypoints.length > 0) {
          drawRouteAndUnit(timestamp);
      }

      // User Click Target Animation
      if (target && target.anim > 0) {
          const tx = (target.x / 100) * rect.width;
          const ty = (target.y / 100) * rect.height;
          
          ctx.strokeStyle = `rgba(74, 222, 128, ${target.anim})`;
          ctx.lineWidth = 2;
          
          // Shrinking circle
          ctx.beginPath();
          ctx.arc(tx, ty, 20 * target.anim + 5, 0, Math.PI * 2);
          ctx.stroke();
          
          // Crosshairs
          ctx.beginPath();
          ctx.moveTo(tx - 10, ty);
          ctx.lineTo(tx + 10, ty);
          ctx.moveTo(tx, ty - 10);
          ctx.lineTo(tx, ty + 10);
          ctx.stroke();

          // Text
          if (target.anim > 0.5) {
              ctx.fillStyle = `rgba(74, 222, 128, ${target.anim})`;
              ctx.font = '10px "Share Tech Mono"';
              ctx.fillText(`LOCK: ${Math.floor(target.x)},${Math.floor(target.y)}`, tx + 15, ty - 15);
          }

          // Decay animation
          target.anim -= 0.02;
          if (target.anim < 0) setTarget(null); // Stop rendering when done
          else setTarget({...target}); // Force re-render
      }
      
      // Radar Sweep
      if (scanning || waypoints.length === 0) {
          const cx = rect.width / 2;
          const cy = rect.height / 2;
          const radius = Math.max(rect.width, rect.height) * 0.8;
          const gradient = ctx.createConicGradient(radarAngle, cx, cy);
          gradient.addColorStop(0, 'rgba(74, 222, 128, 0)');
          gradient.addColorStop(0.9, 'rgba(74, 222, 128, 0)');
          gradient.addColorStop(1, 'rgba(74, 222, 128, 0.15)');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(radarAngle) * radius, cy + Math.sin(radarAngle) * radius);
          ctx.strokeStyle = 'rgba(74, 222, 128, 0.4)';
          ctx.stroke();
          radarAngle += 0.02;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [waypoints, scanning, target]);

  return (
    <canvas 
      ref={canvasRef} 
      onClick={handleCanvasClick}
      className="w-full h-full block cursor-crosshair active:cursor-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default TacticalMap;