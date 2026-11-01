import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Palette, Check, X } from 'lucide-react';
import { ACCENT_PRESETS } from '../templates/themeUtils';

export default function ColorPickerPopover({
  value = '#2563eb',
  onChange,
  buttonClassName = ''
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, isMobile: false });
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 640;

    if (isMobile) {
      setCoords({ top: 0, left: 0, isMobile: true });
      return;
    }

    const popoverWidth = 264;
    const popoverHeight = 220;

    let left = rect.right - popoverWidth;
    if (left < 12) left = 12;
    if (left + popoverWidth > vw - 12) left = vw - popoverWidth - 12;

    let top = rect.bottom + 8;
    if (top + popoverHeight > vh - 12 && rect.top > popoverHeight + 12) {
      top = rect.top - popoverHeight - 8;
    }

    setCoords({ top, left, isMobile: false });
  };

  useEffect(() => {
    if (!open) return;
    updatePosition();

    function handleClickOutside(e) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const popoverContent = open ? (
    coords.isMobile ? (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-space-950/75 backdrop-blur-sm">
        <div
          ref={popoverRef}
          className="w-full max-w-xs p-5 rounded-2xl glass-panel border border-blue-500/35 shadow-2xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-space-800 pb-2.5">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-electric-400" />
              <span>Select Resume Accent Color</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white bg-space-900"
              aria-label="Close color picker"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {ACCENT_PRESETS.map((preset) => {
              const selected = value.toLowerCase() === preset.hex.toLowerCase();
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    onChange(preset.hex);
                    setOpen(false);
                  }}
                  title={preset.name}
                  className={`h-10 rounded-xl border flex items-center justify-center transition-transform ${
                    selected
                      ? 'border-white scale-105 shadow-md'
                      : 'border-white/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.hex }}
                >
                  {selected && <Check className="w-4 h-4 text-white drop-shadow" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2.5 border-t border-space-800 flex items-center justify-between gap-2">
            <span className="text-xs text-slate-300 font-medium">Custom Shade:</span>
            <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-space-900 hover:bg-space-850 border border-blue-500/25 text-xs font-semibold text-electric-400 cursor-pointer">
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-4 h-4 rounded cursor-pointer bg-transparent border-0 p-0"
              />
              <span>Pick Any</span>
            </label>
          </div>
        </div>
      </div>
    ) : (
      <div
        ref={popoverRef}
        style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
        className="fixed z-[9999] w-64 p-4 rounded-2xl glass-panel border border-blue-500/35 shadow-2xl space-y-3"
      >
        <div className="flex items-center justify-between border-b border-space-800 pb-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-electric-400" />
            <span>Select Accent Color</span>
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-space-900 text-slate-300 border border-blue-500/20">
            {value}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {ACCENT_PRESETS.map((preset) => {
            const selected = value.toLowerCase() === preset.hex.toLowerCase();
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onChange(preset.hex);
                  setOpen(false);
                }}
                title={preset.name}
                className={`h-9 rounded-xl border flex items-center justify-center transition-transform ${
                  selected
                    ? 'border-white scale-105 shadow-md'
                    : 'border-white/20 hover:scale-105'
                }`}
                style={{ backgroundColor: preset.hex }}
              >
                {selected && <Check className="w-4 h-4 text-white drop-shadow" />}
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-space-800 flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-300 font-medium">Custom Shade:</span>
          <label className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-space-900 hover:bg-space-850 border border-blue-500/25 text-[11px] font-semibold text-electric-400 cursor-pointer">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 rounded cursor-pointer bg-transparent border-0 p-0"
            />
            <span>Pick Any</span>
          </label>
        </div>
      </div>
    )
  ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={
          buttonClassName ||
          'h-9 px-3 rounded-xl text-xs font-semibold text-slate-200 bg-space-850 hover:bg-space-800 border border-blue-500/25 flex items-center justify-center gap-1.5 transition-all whitespace-nowrap'
        }
        title="Choose Resume Color"
      >
        <span
          className="w-3.5 h-3.5 rounded-full border border-white/40 shrink-0 shadow-sm"
          style={{ backgroundColor: value }}
        />
        <Palette className="w-3.5 h-3.5 text-electric-400 hidden sm:inline" />
        <span>Color</span>
      </button>
      {typeof document !== 'undefined' && popoverContent
        ? createPortal(popoverContent, document.body)
        : null}
    </>
  );
}
