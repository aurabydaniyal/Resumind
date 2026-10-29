import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function HeroVisual() {
  const mountRef = useRef(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setWebGlSupported(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    let scene, camera, renderer, particles, wireframeOrb, outerRing, secondRing, innerOrb;
    let animationFrameId;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 72;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      container.appendChild(renderer.domElement);

      // 1. Starfield particle cloud
      const particleCount = 260;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 140;
        positions[i + 1] = (Math.random() - 0.5) * 95;
        positions[i + 2] = (Math.random() - 0.5) * 70;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        color: 0x60A5FA,
        size: 1.9,
        transparent: true,
        opacity: 0.65
      });
      particles = new THREE.Points(geometry, particleMaterial);
      scene.add(particles);

      // 2. Wireframe Icosahedron Core
      const orbGeometry = new THREE.IcosahedronGeometry(20, 1);
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x3B82F6,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });
      wireframeOrb = new THREE.Mesh(orbGeometry, wireframeMaterial);
      scene.add(wireframeOrb);

      // 3. Outer 3D Orbital Torus Ring 1
      const ringGeometry = new THREE.TorusGeometry(29, 0.25, 16, 100);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x60A5FA,
        transparent: true,
        opacity: 0.32
      });
      outerRing = new THREE.Mesh(ringGeometry, ringMaterial);
      outerRing.rotation.x = Math.PI / 2.6;
      scene.add(outerRing);

      // 4. Outer 3D Orbital Torus Ring 2
      const secondRingGeo = new THREE.TorusGeometry(35, 0.18, 16, 100);
      const secondRingMat = new THREE.MeshBasicMaterial({
        color: 0x818CF8,
        transparent: true,
        opacity: 0.22
      });
      secondRing = new THREE.Mesh(secondRingGeo, secondRingMat);
      secondRing.rotation.x = -Math.PI / 3;
      secondRing.rotation.y = Math.PI / 5;
      scene.add(secondRing);

      // 5. Inner subtle glow sphere
      const innerGeometry = new THREE.SphereGeometry(13, 24, 24);
      const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x2563EB,
        wireframe: false,
        transparent: true,
        opacity: 0.14
      });
      innerOrb = new THREE.Mesh(innerGeometry, innerMaterial);
      scene.add(innerOrb);

      const handleMouseMove = (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 12;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 12;
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener('resize', handleResize);

      let clock = new THREE.Clock();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        currentMouseX += (targetMouseX - currentMouseX) * 0.05;
        currentMouseY += (targetMouseY - currentMouseY) * 0.05;

        if (wireframeOrb) {
          wireframeOrb.rotation.y = elapsedTime * 0.14 + currentMouseX * 0.05;
          wireframeOrb.rotation.x = elapsedTime * 0.09 + currentMouseY * 0.05;
        }

        if (outerRing) {
          outerRing.rotation.z = elapsedTime * 0.22;
          outerRing.rotation.y = Math.sin(elapsedTime * 0.4) * 0.25 + currentMouseX * 0.03;
        }

        if (secondRing) {
          secondRing.rotation.z = -elapsedTime * 0.16;
          secondRing.rotation.x = -Math.PI / 3 + Math.cos(elapsedTime * 0.3) * 0.2;
        }

        if (particles) {
          particles.rotation.y = -elapsedTime * 0.035 + currentMouseX * 0.02;
          particles.rotation.x = currentMouseY * 0.02;
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
        geometry.dispose();
        particleMaterial.dispose();
        orbGeometry.dispose();
        wireframeMaterial.dispose();
        ringGeometry.dispose();
        ringMaterial.dispose();
        secondRingGeo.dispose();
        secondRingMat.dispose();
        innerGeometry.dispose();
        innerMaterial.dispose();
      };
    } catch (err) {
      console.warn('WebGL initialization fallback:', err.message);
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
