import { useEffect, useRef } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function Sparkline({ 
  data, 
  width = 300, 
  height = 80, 
  color = 'hsl(18, 72%, 42%)',
  className = ''
}: SparklineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find min and max for scaling
    const max = Math.max(...data, 0);
    const min = Math.min(...data, 0);
    const range = max - min || 1;

    // Calculate points
    const points = data.map((value, index) => ({
      x: (index / (data.length - 1 || 1)) * width,
      y: height - ((value - min) / range) * (height - 20) - 10,
    }));

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color.replace(')', ', 0.3)').replace('hsl', 'hsla'));
    gradient.addColorStop(1, color.replace(')', ', 0)').replace('hsl', 'hsla'));

    ctx.beginPath();
    ctx.moveTo(points[0].x, height);
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.lineTo(point.x, point.y);
      } else {
        const prevPoint = points[index - 1];
        const cpx = (prevPoint.x + point.x) / 2;
        ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cpx, (prevPoint.y + point.y) / 2);
        ctx.quadraticCurveTo(point.x, point.y, point.x, point.y);
      }
    });
    ctx.lineTo(points[points.length - 1].x, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((point, index) => {
      if (index === 0) return;
      const prevPoint = points[index - 1];
      const cpx = (prevPoint.x + point.x) / 2;
      ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cpx, (prevPoint.y + point.y) / 2);
      ctx.quadraticCurveTo(point.x, point.y, point.x, point.y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, [data, width, height, color]);

  if (data.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <p className="text-sm text-muted-foreground">No data yet</p>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height }}
      data-testid="sparkline-canvas"
    />
  );
}
