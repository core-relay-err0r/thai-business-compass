"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      {/* Main globe */}
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#1a1a2e"
          wireframe
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Outer glow sphere */}
      <Sphere ref={glowRef} args={[2.1, 32, 32]}>
        <meshBasicMaterial
          color="#9b87f5"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Grid lines - latitude */}
      {[...Array(8)].map((_, i) => {
        const radius = 2.02;
        const y = (i - 4) * 0.4;
        const circleRadius = Math.sqrt(radius * radius - y * y);
        return (
          <mesh key={`lat-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[circleRadius - 0.01, circleRadius, 64]} />
            <meshBasicMaterial color="#9b87f5" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
        );
      })}

      {/* Grid lines - longitude */}
      {[...Array(12)].map((_, i) => (
        <mesh key={`lon-${i}`} rotation={[0, (i * Math.PI) / 6, 0]}>
          <torusGeometry args={[2.02, 0.005, 8, 64]} />
          <meshBasicMaterial color="#9b87f5" transparent opacity={0.2} />
        </mesh>
      ))}

      {/* Floating particles */}
      {[...Array(50)].map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 50);
        const theta = Math.sqrt(50 * Math.PI) * phi;
        const x = 2.3 * Math.cos(theta) * Math.sin(phi);
        const y = 2.3 * Math.sin(theta) * Math.sin(phi);
        const z = 2.3 * Math.cos(phi);
        return (
          <mesh key={`particle-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#9b87f5" transparent opacity={0.6} />
          </mesh>
        );
      })}

      {/* Ambient light */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#9b87f5" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
    </group>
  );
}

export function Globe3D({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <Globe />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
