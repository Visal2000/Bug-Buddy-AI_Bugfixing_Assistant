import React, { useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import * as THREE from 'three';

const ParticleBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { state } = useApp();

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create particles
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Color based on theme
      if (state.theme === 'dark') {
        colors[i * 3] = 0.3 + Math.random() * 0.7; // R
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.8; // G
        colors[i * 3 + 2] = 1.0; // B
      } else {
        colors[i * 3] = 0.2 + Math.random() * 0.8; // R
        colors[i * 3 + 1] = 0.1 + Math.random() * 0.9; // G
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2; // B
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      particles.rotation.x += 0.0005;
      particles.rotation.y += 0.001;
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [state.theme]);

  return <div ref={mountRef} className="fixed inset-0 -z-10 pointer-events-none" />;
};

export default ParticleBackground;