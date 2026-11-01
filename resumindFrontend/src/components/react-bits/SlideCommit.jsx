import React, { useState, useRef } from 'react';
import { ArrowRight, Check, Loader2, AlertCircle } from 'lucide-react';
import './SlideCommit.css';

/**
 * @react-bits/SlideCommit-JS-CSS
 * Slide-to-commit (and click-accessible) button for generating ATS Resume Score.
 * When weekly limit is full (`limitFull`), displays an '!' icon and opens the wait popup on interaction.
 */
export default function SlideCommit({
  onCommit,
  disabled = false,
  loading = false,
  limitFull = false,
  onLimitClick,
  label = 'Slide to Generate ATS Score',
  loadingLabel = 'Evaluating Resume...',
  limitLabel = 'Weekly Limit Reached (!)',
  className = ''
}) {
  const trackRef = useRef(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [committed, setCommitted] = useState(false);
  const startXRef = useRef(0);
  const movedRef = useRef(false);

  const getMaxSlide = () => {
    if (!trackRef.current) return 240;
    return Math.max(10, trackRef.current.clientWidth - 56);
  };

  const triggerCommit = () => {
    if (limitFull) {
      onLimitClick?.();
      return;
    }
    if (disabled || loading) return;
    setCommitted(true);
    setDragX(getMaxSlide());
    setTimeout(() => {
      onCommit?.();
      setTimeout(() => {
        setCommitted(false);
        setDragX(0);
      }, 600);
    }, 140);
  };

  const handlePointerDown = (e) => {
    if (limitFull) {
      onLimitClick?.();
      return;
    }
    if (disabled || loading) return;
    setDragging(true);
    movedRef.current = false;
    startXRef.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
  };

  const handlePointerMove = (e) => {
    if (!dragging || disabled || loading || limitFull) return;
    const currentX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const delta = Math.max(0, Math.min(getMaxSlide(), currentX - startXRef.current));
    if (delta > 6) movedRef.current = true;
    setDragX(delta);

    if (delta >= getMaxSlide() * 0.78) {
      setDragging(false);
      triggerCommit();
    }
  };

  const handlePointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (!movedRef.current) {
      // Direct click/tap also triggers commit for smooth accessibility
      triggerCommit();
    } else if (dragX < getMaxSlide() * 0.78) {
      setDragX(0);
    }
  };

  return (
    <div
      ref={trackRef}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || limitFull}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        if (dragging) {
          setDragging(false);
          setDragX(0);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerCommit();
        }
      }}
      className={`rb-slide-commit ${disabled ? 'rb-slide-commit--disabled' : ''} ${
        limitFull ? 'rb-slide-commit--limit' : ''
      } ${className}`}
    >
      {/* Progress Fill */}
      <div
        className="rb-slide-commit__fill"
        style={{ width: `${dragX > 0 ? dragX + 44 : 0}px` }}
      />

      {/* Center Label */}
      <div className="rb-slide-commit__label">
        {loading ? (
          <span className="flex items-center gap-2 text-white">
            <Loader2 className="w-4 h-4 animate-spin text-[#3b9eff]" />
            <span>{loadingLabel}</span>
          </span>
        ) : limitFull ? (
          <span className="flex items-center gap-1.5 text-amber-300 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{limitLabel}</span>
          </span>
        ) : (
          <span className="rb-slide-commit__shimmer">{label}</span>
        )}
      </div>

      {/* Sliding Thumb */}
      <div
        className="rb-slide-commit__thumb"
        style={{
          transform: `translateX(${dragX}px)`,
          transition: dragging ? 'none' : 'transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : limitFull ? (
          <span className="font-black text-base leading-none text-white" title="Weekly Limit Reached">
            !
          </span>
        ) : committed ? (
          <Check className="w-4 h-4" />
        ) : (
          <ArrowRight className="w-4 h-4" />
        )}
      </div>
    </div>
  );
}

