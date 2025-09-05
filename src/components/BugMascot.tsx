import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface BugMascotProps {
  className?: string;
}

const BugMascot: React.FC<BugMascotProps> = ({ className = "" }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(400, 400);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create bug mascot
    const bugGroup = new THREE.Group();

    // Body (main oval)
    const bodyGeometry = new THREE.SphereGeometry(1, 16, 12);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4F46E5 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.scale.set(1, 0.7, 1.2);
    bugGroup.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.6, 16, 12);
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0x6366F1 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 0.8, 0.8);
    bugGroup.add(head);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 6);
    const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.25, 0.9, 1.2);
    bugGroup.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.25, 0.9, 1.2);
    bugGroup.add(rightEye);

    // Eye pupils
    const pupilGeometry = new THREE.SphereGeometry(0.08, 6, 4);
    const pupilMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(-0.25, 0.9, 1.28);
    bugGroup.add(leftPupil);
    
    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(0.25, 0.9, 1.28);
    bugGroup.add(rightPupil);

    // Wings
    const wingGeometry = new THREE.CylinderGeometry(0.8, 0.6, 0.05, 8);
    const wingMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x22D3EE, 
      transparent: true, 
      opacity: 0.8 
    });
    
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-1, 0.5, 0);
    leftWing.rotation.z = Math.PI / 4;
    bugGroup.add(leftWing);
    
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(1, 0.5, 0);
    rightWing.rotation.z = -Math.PI / 4;
    bugGroup.add(rightWing);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
    const legMaterial = new THREE.MeshLambertMaterial({ color: 0x1E293B });
    
    for (let i = 0; i < 6; i++) {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      const angle = (i / 6) * Math.PI * 2;
      leg.position.set(Math.cos(angle) * 1.2, -0.8, Math.sin(angle) * 0.8);
      leg.rotation.z = angle;
      leg.rotation.x = Math.PI / 6;
      bugGroup.add(leg);
    }

    // Antennae
    const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6);
    const antennaMaterial = new THREE.MeshLambertMaterial({ color: 0x374151 });
    
    const leftAntenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    leftAntenna.position.set(-0.2, 1.3, 0.8);
    leftAntenna.rotation.z = Math.PI / 8;
    bugGroup.add(leftAntenna);
    
    const rightAntenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    rightAntenna.position.set(0.2, 1.3, 0.8);
    rightAntenna.rotation.z = -Math.PI / 8;
    bugGroup.add(rightAntenna);

    scene.add(bugGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.set(0, 0, 5);

    // Mouse tracking
    const handleMouseMove = (event: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (rect) {
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      // Floating animation
      bugGroup.position.y = Math.sin(time) * 0.2;
      bugGroup.rotation.y = Math.sin(time * 0.5) * 0.1;
      
      // Eye tracking
      leftPupil.position.x = -0.25 + mouseRef.current.x * 0.1;
      leftPupil.position.y = 0.9 + mouseRef.current.y * 0.1;
      rightPupil.position.x = 0.25 + mouseRef.current.x * 0.1;
      rightPupil.position.y = 0.9 + mouseRef.current.y * 0.1;
      
      // Wing flapping
      leftWing.rotation.y = Math.sin(time * 8) * 0.3;
      rightWing.rotation.y = Math.sin(time * 8) * 0.3;
      
      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mountRef} 
        className={`w-96 h-96 transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default BugMascot;