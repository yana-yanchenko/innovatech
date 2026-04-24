'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Line, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from 'next-themes';
import ResilientCanvas from './ResilientCanvas';

interface NodeData {
  id: string;
  label: string;
  description: string;
}

interface ModelProps {
  nodes: NodeData[];
  onNodeHover: (info: { nodeId: string; label: string; description: string } | null) => void;
  pauseRotation: boolean;
}

function InteractiveNode({
  position,
  nodeData,
  onNodeHover,
  color,
}: {
  position: [number, number, number];
  nodeData: NodeData;
  onNodeHover: (info: { nodeId: string; label: string; description: string } | null) => void;
  color: string;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 2.5) * 0.12;
      meshRef.current.scale.setScalar(hovered ? 1.6 : pulse);
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 2.5 + 0.5) * 0.2;
      glowRef.current.scale.setScalar(hovered ? 2.2 : pulse * 1.5);
      (glowRef.current.material as THREE.MeshStandardMaterial).opacity = hovered ? 0.35 : 0.15;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={glowRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onNodeHover({ nodeId: nodeData.id, label: nodeData.label, description: nodeData.description });
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          onNodeHover(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.15} depthWrite={false} />
      </mesh>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onNodeHover({ nodeId: nodeData.id, label: nodeData.label, description: nodeData.description });
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          onNodeHover(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 3 : 1.2} roughness={0} metalness={0.2} />
      </mesh>
    </group>
  );
}

function MultiRowScene({
  nodes,
  onNodeHover,
  color,
  floorColor,
  floorOpacity,
  pauseRotation,
}: {
  nodes: NodeData[];
  onNodeHover: (info: { nodeId: string; label: string; description: string } | null) => void;
  color: string;
  floorColor: string;
  floorOpacity: number;
  pauseRotation: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && !pauseRotation) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  const spanProfile = useMemo(() => {
    const points: [number, number, number][] = [];
    const halfWidth = 1.65;
    const wallHeight = 1.6;
    const peakY = 3.15;
    const steps = 14;

    points.push([-halfWidth, 0, 0]);
    points.push([-halfWidth, wallHeight, 0]);
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const x = -halfWidth + t * halfWidth;
      const y = wallHeight + (peakY - wallHeight) * Math.sin(t * (Math.PI / 2));
      points.push([x, y, 0]);
    }
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const x = t * halfWidth;
      const y = peakY - (peakY - wallHeight) * (1 - Math.cos(t * (Math.PI / 2)));
      points.push([x, y, 0]);
    }
    points.push([halfWidth, 0, 0]);

    return points;
  }, []);

  const spanCenters = [-3.3, 0, 3.3];
  const zFrames = [-5.4, -4.2, -3, -1.8, -0.6, 0.6, 1.8, 3, 4.2, 5.4];

  const nodePositions: Record<string, [number, number, number]> = {
    gutter: [1.65, 1.6, 0.5],
    ridgeVent: [0, 3.15, 2.4],
    sideVent: [4.95, 1.9, -1.2],
    door: [0, 1.2, -5.45],
    endwall: [0, 2.15, 5.45],
  };

  return (
    <group ref={groupRef} position={[0, -1.3, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[18, 15]} />
        <meshStandardMaterial color={floorColor} transparent opacity={floorOpacity} />
      </mesh>

      {spanCenters.map((xCenter, si) => (
        <group key={si}>
          {zFrames.map((z, i) => (
            <group key={i} position={[xCenter, 0, z]}>
              <Line points={spanProfile} color={color} lineWidth={2.1} />
              <Line points={[[-1.65, 0, 0], [1.65, 0, 0]]} color={color} lineWidth={1.6} />
            </group>
          ))}

          <Line points={[[xCenter, 3.15, -5.4], [xCenter, 3.15, 5.4]]} color={color} lineWidth={1.6} />
          <Line points={[[xCenter - 1.65, 1.6, -5.4], [xCenter - 1.65, 1.6, 5.4]]} color={color} lineWidth={1.4} />
          <Line points={[[xCenter + 1.65, 1.6, -5.4], [xCenter + 1.65, 1.6, 5.4]]} color={color} lineWidth={1.4} />
          <Line points={[[xCenter - 1.65, 0, -5.4], [xCenter - 1.65, 0, 5.4]]} color={color} lineWidth={1.3} />
          <Line points={[[xCenter + 1.65, 0, -5.4], [xCenter + 1.65, 0, 5.4]]} color={color} lineWidth={1.3} />
        </group>
      ))}

      <Line points={[[-1.65, 1.6, -5.4], [-1.65, 1.6, 5.4]]} color={color} lineWidth={2.2} />
      <Line points={[[1.65, 1.6, -5.4], [1.65, 1.6, 5.4]]} color={color} lineWidth={2.2} />

      <Line points={[[-0.8, 0, -5.44], [0.8, 0, -5.44], [0.8, 2.2, -5.44], [-0.8, 2.2, -5.44], [-0.8, 0, -5.44]]} color={color} lineWidth={2} />

      {[-1.8, 1.8].map((z, i) => (
        <Line key={i} points={[[4.98, 1.4, z - 0.8], [4.98, 2, z - 0.8], [4.98, 2, z + 0.8], [4.98, 1.4, z + 0.8], [4.98, 1.4, z - 0.8]]} color={color} lineWidth={1.1} />
      ))}

      {nodes.map((node) => {
        const pos = nodePositions[node.id];
        if (!pos) return null;
        return <InteractiveNode key={node.id} position={pos} nodeData={node} onNodeHover={onNodeHover} color={color} />;
      })}
    </group>
  );
}

export default function MultiRowGreenhouseModel({ nodes, onNodeHover, pauseRotation }: ModelProps) {
  const { resolvedTheme } = useTheme();
  const isDark = (resolvedTheme ?? 'light') === 'dark';
  const color = isDark ? '#58d1a5' : '#45c396';
  const floorColor = isDark ? '#8ecb88' : '#b8e6b5';
  const floorOpacity = isDark ? 0.38 : 0.45;

  return (
    <ResilientCanvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
      <PerspectiveCamera makeDefault position={[10.8, 6.2, 11.4]} fov={42} />
      <ambientLight intensity={isDark ? 0.35 : 0.75} />
      <spotLight position={[9, 12, 7]} angle={0.25} penumbra={1} intensity={isDark ? 2.4 : 1.8} castShadow />
      <pointLight position={[-6, 4, -4]} intensity={0.45} color={color} />
      <Environment preset={isDark ? 'night' : 'city'} />
      <fog attach="fog" args={[isDark ? '#0a0a0a' : '#edf9f5', 18, 48]} />
      <MultiRowScene nodes={nodes} onNodeHover={onNodeHover} color={color} floorColor={floorColor} floorOpacity={floorOpacity} pauseRotation={pauseRotation} />
      <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} />
    </ResilientCanvas>
  );
}
