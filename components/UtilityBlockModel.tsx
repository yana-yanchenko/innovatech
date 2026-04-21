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

function UtilityBlockScene({
  nodes,
  onNodeHover,
  color,
  pauseRotation,
}: {
  nodes: NodeData[];
  onNodeHover: (info: { nodeId: string; label: string; description: string } | null) => void;
  color: string;
  pauseRotation: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && !pauseRotation) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  const zFrames = [-6.4, -5, -3.6, -2.2, -0.8, 0.6, 2, 3.4, 4.8, 6.2, 7.6];

  const frameData = useMemo(() => {
    const buildCenterProfile = (halfWidth: number, wallHeight: number, peakY: number) => {
      const points: [number, number, number][] = [];
      points.push([-halfWidth, 0, 0]);
      points.push([-halfWidth, wallHeight, 0]);
      const steps = 22;
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
    };

    const buildSideWingProfile = (span: number, wallHeight: number, topY: number) => {
      const points: [number, number, number][] = [];
      points.push([0, 0, 0]);
      points.push([0, wallHeight, 0]);
      const steps = 12;
      for (let i = 0; i <= steps; i += 1) {
        const t = i / steps;
        const x = t * span;
        const y = wallHeight + (topY - wallHeight) * Math.sin(t * (Math.PI / 2));
        points.push([x, y, 0]);
      }
      points.push([span, 0, 0]);
      return points;
    };

    return zFrames.map((z, i) => {
      const t = i / (zFrames.length - 1);
      const halfWidth = 2.35;
      const wallHeight = 2.35 + t * 0.85;
      const peakY = 3.95 + t * 1.35;
      const sideWallHeight = 1.4 + t * 0.45;
      const sideTopY = 2.2 + t * 0.55;
      return {
        z,
        wallHeight,
        peakY,
        sideWallHeight,
        centerProfile: buildCenterProfile(halfWidth, wallHeight, peakY),
        sideWingProfile: buildSideWingProfile(1.55, sideWallHeight, sideTopY),
      };
    });
  }, [zFrames]);

  const nodePositions: Record<string, [number, number, number]> = {
    gate: [0, 1.2, -6.45],
    wall: [2.4, 2.1, 3.4],
    roof: [0, 4.8, 3.6],
    arch: [-1.7, 3.75, 5.4],
  };

  return (
    <group ref={groupRef} position={[0, -1.4, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#101010" transparent opacity={0.28} />
      </mesh>

      {frameData.map((frame, i) => (
        <group key={i} position={[0, 0, frame.z]}>
          <Line points={frame.centerProfile} color={color} lineWidth={2.4} />

          <group position={[-2.35, 0, 0]}>
            <Line points={frame.sideWingProfile.map(([x, y, zz]) => [-x, y, zz] as [number, number, number])} color={color} lineWidth={1.8} />
          </group>
          <group position={[2.35, 0, 0]}>
            <Line points={frame.sideWingProfile} color={color} lineWidth={1.8} />
          </group>
        </group>
      ))}

      <Line points={frameData.map((frame) => [0, frame.peakY, frame.z] as [number, number, number])} color={color} lineWidth={1.8} />
      <Line points={frameData.map((frame) => [-2.35, frame.wallHeight, frame.z] as [number, number, number])} color={color} lineWidth={1.6} />
      <Line points={frameData.map((frame) => [2.35, frame.wallHeight, frame.z] as [number, number, number])} color={color} lineWidth={1.6} />

      <Line points={frameData.map((frame) => [-3.9, frame.sideWallHeight, frame.z] as [number, number, number])} color={color} lineWidth={1.2} />
      <Line points={frameData.map((frame) => [3.9, frame.sideWallHeight, frame.z] as [number, number, number])} color={color} lineWidth={1.2} />
      <Line points={frameData.map((frame) => [-3.9, 0, frame.z] as [number, number, number])} color={color} lineWidth={1.2} />
      <Line points={frameData.map((frame) => [3.9, 0, frame.z] as [number, number, number])} color={color} lineWidth={1.2} />

      {frameData.slice(0, -1).map((frame, i) => (
        <group key={i}>
          <Line
            points={[
              [-2.35, frame.wallHeight, frame.z],
              [0, frameData[i + 1].peakY, frameData[i + 1].z],
              [2.35, frame.wallHeight, frame.z],
            ]}
            color={color}
            lineWidth={1}
          />
          <Line points={[[-3.9, frame.sideWallHeight, frame.z], [-2.35, frameData[i + 1].wallHeight, frameData[i + 1].z]]} color={color} lineWidth={0.9} />
          <Line points={[[3.9, frame.sideWallHeight, frame.z], [2.35, frameData[i + 1].wallHeight, frameData[i + 1].z]]} color={color} lineWidth={0.9} />
        </group>
      ))}

      <Line
        points={[
          [-1.05, 0, -6.44],
          [1.05, 0, -6.44],
          [1.05, 2.3, -6.44],
          [-1.05, 2.3, -6.44],
          [-1.05, 0, -6.44],
        ]}
        color={color}
        lineWidth={2}
      />
      <Line points={[[-0.95, 2.42, -6.44], [0.95, 2.42, -6.44]]} color={color} lineWidth={1.2} />

      {nodes.map((node) => {
        const pos = nodePositions[node.id];
        if (!pos) return null;
        return <InteractiveNode key={node.id} position={pos} nodeData={node} onNodeHover={onNodeHover} color={color} />;
      })}
    </group>
  );
}

export default function UtilityBlockModel({ nodes, onNodeHover, pauseRotation }: ModelProps) {
  const { resolvedTheme } = useTheme();
  const isDark = (resolvedTheme ?? 'light') === 'dark';
  const color = isDark ? '#58d1a5' : '#45c396';

  return (
    <ResilientCanvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
      <PerspectiveCamera makeDefault position={[10.2, 6.4, 11.2]} fov={42} />
      <ambientLight intensity={isDark ? 0.35 : 0.75} />
      <spotLight position={[9, 11, 7]} angle={0.25} penumbra={1} intensity={isDark ? 2.4 : 1.8} castShadow />
      <pointLight position={[-6, 4, -4]} intensity={0.45} color={color} />
      <Environment preset={isDark ? 'night' : 'city'} />
      <fog attach="fog" args={[isDark ? '#0a0a0a' : '#edf9f5', 18, 48]} />
      <UtilityBlockScene nodes={nodes} onNodeHover={onNodeHover} color={color} pauseRotation={pauseRotation} />
      <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} />
    </ResilientCanvas>
  );
}
