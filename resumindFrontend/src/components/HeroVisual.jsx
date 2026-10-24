import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function HeroVisual() {
  const mountRef = useRef(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setWebGlSupported(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    let scene, camera, renderer, particles, wireframeOrb;
    let animationFrameId;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 70;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);

      // 1. Subtle particle cloud (Low count: 180 particles for zero GPU strain)
      const particleCount = 180;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 120;
        positions[i + 1] = (Math.random() - 0.5) * 80;
        positions[i + 2] = (Math.random() - 0.5) * 60;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        color: 0x60A5FA,
        size: 1.8,
        transparent: true,
        opacity: 0.55
      });
      particles = new THREE.Points(geometry, particleMaterial);
      scene.add(particles);

      // 2. Wireframe Icosahedron / Orb (Delicate geometric core)
      const orbGeometry = new THREE.IcosahedronGeometry(22, 1);
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x2563EB,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });
      wireframeOrb = new THREE.Mesh(orbGeometry, wireframeMaterial);
      scene.add(wireframeOrb);

      // Inner subtle glow sphere
      const innerGeometry = new THREE.SphereGeometry(14, 16, 16);
      const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x1D4ED8,
        wireframe: false,
        transparent: true,
        opacity: 0.12
      });
      const innerOrb = new THREE.Mesh(innerGeometry, innerMaterial);
      scene.add(innerOrb);

      // Resize listener
      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener('resize', handleResize);

      // Animation loop
      let clock = new THREE.Clock();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        if (wireframeOrb) {
          wireframeOrb.rotation.y = elapsedTime * 0.12;
          wireframeOrb.rotation.x = elapsedTime * 0.08;
        }

        if (particles) {
          particles.rotation.y = -elapsedTime * 0.04;
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
        geometry.dispose();
        particleMaterial.dispose();
        orbGeometry.dispose();
        wireframeMaterial.dispose();
        innerGeometry.dispose();
        innerMaterial.dispose();
      };
    } catch (err) {
      console.warn('WebGL initialization failed, falling back to CSS background:', err.message);
      setWebGlSupported(false);
    }
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 flex items-center justify-center"
    >
      {!webGlSupported && (
        <div className="w-96 h-96 rounded-full bg-gradient-to-tr from-electric-900/30 to-electric-600/20 blur-3xl opacity-60" />
      )}
    </div>
  );
}
