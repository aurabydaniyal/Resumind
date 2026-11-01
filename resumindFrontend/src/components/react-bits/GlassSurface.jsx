import React, { useId } from 'react';
import './GlassSurface.css';

/**
 * @react-bits/GlassSurface-JS-CSS
 * Apple-inspired liquid frosted glass surface with SVG refraction filter and Smart Blue / Prussian Blue specular rims.
 */
export default function GlassSurface({
  children,
  as: Component = 'div',
  width,
  height,
  borderRadius = 18,
  blur = 18,
  saturation = 165,
  interactive = false,
  className = '',
  style = {},
  ...rest
}) {
  const rawId = useId();
  const filterId = `rb-glass-filter-${rawId.replace(/:/g, '')}`;

  const combinedStyle = {
    width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
    '--glass-blur': `${blur}px`,
    '--glass-saturation': `${saturation}%`,
    ...style
  };

  return (
    <Component
      className={`rb-glass-surface ${interactive ? 'rb-glass-surface--interactive' : ''} ${className}`}
      style={combinedStyle}
      {...rest}
    >
      <svg className="rb-glass-surface__svg-defs" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.015"
              numOctaves="2"
              seed="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      {children}
    </Component>
  );
}

