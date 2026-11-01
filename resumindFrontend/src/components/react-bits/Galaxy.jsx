import React, { useEffect, useRef } from 'react';
import './Galaxy.css';

/**
 * @react-bits/Galaxy-JS-CSS
 * Interactive celestial galaxy starfield background tuned to Smart Blue (#0466c8),
 * Steel Azure (#0353a4), Regal Navy (#023e7d), Prussian Blue (#001233), and Cool Steel (#979dac).
 */
export default function Galaxy({
  density = 130,
  speed = 0.22,
  glowIntensity = 0.55,
  mouseRepulsion = true,
  className = ''
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const palette = [
      '#ffffff',
      '#979dac', // Cool Steel
      '#0466c8', // Smart Blue
      '#3898ff', // Luminous Smart Blue
      '#0353a4', // Steel Azure
      '#7d8597'  // Slate Grey
    ];

    const isMobile = width < 768;
    const starCount = isMobile ? Math.floor(density * 0.55) : density;

    const stars = Array.from({ length: starCount }, () => {
      const depth = Math.random() * 0.85 + 0.15;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z: depth,
        radius: depth * 1.85 + 0.35,
        color: palette[Math.floor(Math.random() * palette.length)],
        twinkleSpeed: Math.random() * 0.025 + 0.006,
        twinklePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * speed * depth,
        vy: -Math.random() * speed * depth - 0.04
      };
    });

    const mouse = { x: width / 2, y: height / 2, active: false };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    let tick = 0;
    const render = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      // Subtle rotating galaxy core nebula glow
      const centerX = width * 0.5 + (mouse.active ? (mouse.x - width * 0.5) * 0.03 : 0);
      const centerY = height * 0.36 + (mouse.active ? (mouse.y - height * 0.5) * 0.03 : 0);
      const nebulaGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        Math.min(width, height) * 0.55
      );
      nebulaGrad.addColorStop(0, `rgba(4, 102, 200, ${0.14 * glowIntensity})`);
      nebulaGrad.addColorStop(0.45, `rgba(2, 62, 125, ${0.09 * glowIntensity})`);
      nebulaGrad.addColorStop(1, 'rgba(0, 18, 51, 0)');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;

        if (mouseRepulsion && mouse.active) {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const maxDist = 130;
          if (distSq < maxDist * maxDist && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / maxDist) * 0.55 * s.z;
            s.x += (dx / dist) * force;
            s.y += (dy / dist) * force;
          }
        }

        if (s.x < -10) s.x = width + 10;
        if (s.x > width + 10) s.x = -10;
        if (s.y < -10) s.y = height + 10;
        if (s.y > height + 10) s.y = -10;

        const alpha = 0.35 + 0.65 * Math.abs(Math.sin(tick * s.twinkleSpeed + s.twinklePhase));

        ctx.save();
        ctx.globalAlpha = alpha * s.z;
        ctx.fillStyle = s.color;
        if (s.radius > 1.5) {
          ctx.shadowBlur = 8 * glowIntensity;
          ctx.shadowColor = '#0466c8';
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [density, speed, glowIntensity, mouseRepulsion]);

  return (
    <div className={`rb-galaxy-container ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="rb-galaxy-canvas" />
    </div>
  );
}

