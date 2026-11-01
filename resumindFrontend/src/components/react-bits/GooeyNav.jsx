import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './GooeyNav.css';

/**
 * @react-bits/GooeyNav-JS-CSS
 * Interactive morphing navigation bar with liquid indicator blob & particle burst.
 */
export default function GooeyNav({ items = [], className = '' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });
  const [droplets, setDroplets] = useState([]);

  const activeIndex = items.findIndex((item) => {
    if (item.href?.startsWith('/#')) return false;
    return location.pathname === item.href;
  });

  const updateIndicatorPosition = (idx) => {
    const targetIdx = idx >= 0 ? idx : 0;
    const el = itemRefs.current[targetIdx];
    const listEl = listRef.current;
    if (!el || !listEl || idx < 0) {
      setIndicator((prev) => ({ ...prev, visible: false }));
      return;
    }

    const listRect = listEl.getBoundingClientRect();
    const itemRect = el.getBoundingClientRect();
    setIndicator({
      left: itemRect.left - listRect.left + 5,
      width: itemRect.width,
      visible: true
    });
  };

  useEffect(() => {
    updateIndicatorPosition(activeIndex);
    const onResize = () => updateIndicatorPosition(activeIndex);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeIndex, items]);

  const spawnGooeyBurst = (el) => {
    if (!el || !listRef.current) return;
    const listRect = listRef.current.getBoundingClientRect();
    const itemRect = el.getBoundingClientRect();
    const centerX = itemRect.left - listRect.left + itemRect.width / 2;
    const centerY = itemRect.height / 2 + 4;

    const angles = [-145, -110, -70, -35, 35, 75, 115, 150];
    const newDroplets = angles.map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const dist = 18 + (i % 3) * 8;
      return {
        id: `${Date.now()}-${i}`,
        x: centerX,
        y: centerY,
        tx: `${Math.round(Math.cos(rad) * dist)}px`,
        ty: `${Math.round(Math.sin(rad) * dist)}px`
      };
    });

    setDroplets(newDroplets);
    setTimeout(() => setDroplets([]), 560);
  };

  const handleItemClick = (item, idx, e) => {
    e.preventDefault();
    const el = itemRefs.current[idx];
    spawnGooeyBurst(el);
    updateIndicatorPosition(idx);

    if (item.href?.startsWith('/#')) {
      const hash = item.href.replace('/', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const target = document.querySelector(hash);
          target?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        const target = document.querySelector(hash);
        target?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (item.href) {
      navigate(item.href);
    }
  };

  return (
    <div className={`rb-gooey-nav ${className}`}>
      <div className="rb-gooey-nav__blob-layer" aria-hidden="true">
        <div
          className="rb-gooey-nav__indicator"
          style={{
            transform: `translateX(${indicator.left}px)`,
            width: `${indicator.width}px`,
            opacity: indicator.visible ? 1 : 0
          }}
        />
        {droplets.map((d) => (
          <span
            key={d.id}
            className="rb-gooey-nav__droplet"
            style={{
              left: `${d.x}px`,
              top: `${d.y}px`,
              '--tx': d.tx,
              '--ty': d.ty
            }}
          />
        ))}
      </div>

      <ul ref={listRef} className="rb-gooey-nav__list">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isActive = idx === activeIndex;
          return (
            <li key={item.href || item.label}>
              <a
                ref={(el) => (itemRefs.current[idx] = el)}
                href={item.href || '#'}
                onClick={(e) => handleItemClick(item, idx, e)}
                className={`rb-gooey-nav__item ${isActive ? 'rb-gooey-nav__item--active' : ''}`}
              >
                {Icon && (
                  <Icon
                    className={`w-3.5 h-3.5 transition-colors ${
                      isActive ? 'text-white' : 'text-[#3b9eff]'
                    }`}
                  />
                )}
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

