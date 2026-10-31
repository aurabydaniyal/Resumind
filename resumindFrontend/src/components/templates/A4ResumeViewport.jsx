import React, { useRef, useState, useEffect } from 'react';

const A4_WIDTH_PX = 794;
const A4_MIN_HEIGHT_PX = 1123;

/**
 * Renders any resume template inside a true desktop A4 canvas (794px wide)
 * and proportionally scales it down on mobile/tablet screens so the entire
 * page looks identical to the laptop/desktop A4 sheet without internal scrollbars.
 */
export default function A4ResumeViewport({ children }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(A4_MIN_HEIGHT_PX);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const updateDimensions = () => {
      if (!outerRef.current || !innerRef.current) return;
      const availableWidth = outerRef.current.clientWidth;
      const nextScale = Math.min(1, availableWidth / A4_WIDTH_PX);
      const rawHeight = Math.max(A4_MIN_HEIGHT_PX, innerRef.current.offsetHeight);
      setScale(nextScale);
      setScaledHeight(Math.ceil(rawHeight * nextScale));
    };

    updateDimensions();

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(outer);
      resizeObserver.observe(inner);
    }

    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [children]);

  return (
    <div
      ref={outerRef}
      className="w-full flex justify-center overflow-hidden select-text"
      style={{ height: `${scaledHeight}px` }}
    >
      <div
        ref={innerRef}
        style={{
          width: `${A4_WIDTH_PX}px`,
          minHeight: `${A4_MIN_HEIGHT_PX}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top center'
        }}
        className="bg-white shadow-2xl rounded-sm shrink-0 overflow-hidden"
      >
        {children}
      </div>
    </div>
  );
}

