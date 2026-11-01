import React, { useEffect, useRef, useState } from 'react';
import './ElectricLogo.css';

/**
 * @react-bits/ElectricLogo-JS-CSS
 * Wraps the uploaded Resumind AI brand icon with animated crackling Smart Blue (#0466c8) electric arcs
 * and automatically keys out any solid white JPEG background so the icon floats cleanly on dark glass.
 */
export default function ElectricLogo({
  src = '/logo.png',
  size = 40,
  arcColor = '#0466c8',
  coreColor = '#3b9eff',
  className = ''
}) {
  const arcCanvasRef = useRef(null);
  const [processedSrc, setProcessedSrc] = useState(src);
  const [hovered, setHovered] = useState(false);

  // Key out the white background from the uploaded logo image so it floats cleanly
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const offscreen = document.createElement('canvas');
        offscreen.width = img.width;
        offscreen.height = img.height;
        const ctx = offscreen.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, offscreen.width, offscreen.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Detect near-white background pixels and smoothly feather alpha
          const minChannel = Math.min(r, g, b);
          if (minChannel > 236) {
            data[i + 3] = 0;
          } else if (minChannel > 210) {
            const factor = (236 - minChannel) / 26;
            data[i + 3] = Math.round(data[i + 3] * factor);
          }
        }

        ctx.putImageData(imageData, 0, 0);
        setProcessedSrc(offscreen.toDataURL('image/png'));
      } catch {
        setProcessedSrc(src);
      }
    };
    img.src = src;
  }, [src]);

  // Animate crackling electric arcs around the logo perimeter
  useEffect(() => {
    const canvas = arcCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasSize = size + 12;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    let animId;
    let frame = 0;

    const drawLightningStrand = (x1, y1, x2, y2, segments, jitter, color, width, alpha) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      for (let i = 1; i < segments; i++) {
        const t = i / segments;
        const bx = x1 + (x2 - x1) * t + (Math.random() - 0.5) * jitter;
        const by = y1 + (y2 - y1) * t + (Math.random() - 0.5) * jitter;
        ctx.lineTo(bx, by);
      }
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = arcColor;
      ctx.stroke();
      ctx.restore();
    };

    const render = () => {
      frame += 1;
      if (frame % (hovered ? 2 : 4) === 0) {
        ctx.clearRect(0, 0, canvasSize, canvasSize);

        const pad = 5;
        const w = canvasSize - pad * 2;
        const h = canvasSize - pad * 2;
        const corners = [
          [pad, pad],
          [pad + w, pad],
          [pad + w, pad + h],
          [pad, pad + h]
        ];

        const strandCount = hovered ? 3 : 2;
        for (let s = 0; s < strandCount; s++) {
          const edgeIdx = (Math.floor(frame / 4) + s) % 4;
          const [x1, y1] = corners[edgeIdx];
          const [x2, y2] = corners[(edgeIdx + 1) % 4];
          drawLightningStrand(
            x1,
            y1,
            x2,
            y2,
            5,
            hovered ? 5.5 : 3.5,
            s === 0 ? coreColor : arcColor,
            s === 0 ? 1.35 : 0.9,
            hovered ? 0.92 : 0.65
          );
        }
      }
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [size, arcColor, coreColor, hovered]);

  return (
    <div
      className={`rb-electric-logo ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <canvas ref={arcCanvasRef} className="rb-electric-logo__arcs" aria-hidden="true" />
      <img
        src={processedSrc}
        alt="Resumind AI Logo"
        className="rb-electric-logo__img"
        draggable={false}
      />
    </div>
  );
}

