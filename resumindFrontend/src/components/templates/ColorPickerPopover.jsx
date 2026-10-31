import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { ACCENT_PRESETS } from '../templates/themeUtils';

export default function ColorPickerPopover({
  value = '#2563eb',
  onChange,
  buttonClassName = ''
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
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

      {open && (
        <div className="absolute right-0 mt-2 w-64 p-4 rounded-2xl glass-panel border border-blue-500/30 shadow-2xl z-50 space-y-3">
          <div className="flex items-center justify-between border-b border-space-800 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-electric-400" />
              <span>Select Accent Color</span>
            </span>
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-space-900 text-slate-300 border border-blue-500/20"
            >
              {value}
            </span>
          </div>

          {/* Preset Swatches Grid */}
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

          {/* Custom Color Picker Row */}
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
      )}
    </div>
  );
}

