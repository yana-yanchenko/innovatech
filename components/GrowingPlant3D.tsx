'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Points, PointMaterial, MeshDistortMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';

interface GrowingPlantProps {
  progress: number;
  color: string;
}

const Leaf = ({ position, rotation, scale, color, delay = 0 }: { position: [number, number, number], rotation: [number, number, number], scale: number, color: string, delay?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    // Делаем лист более округлым и органичным, как на фото
    s.bezierCurveTo(0.5, 0.2, 0.7, 0.5, 0.6, 1.2);
    s.bezierCurveTo(0.5, 1.0, 0.2, 0.9, 0, 0.3);
    s.closePath();
    return s;
  }, []);

  const leafPoints = useMemo(() => {
    return shape.getPoints().map(p => new THREE.Vector3(p.x, p.y, 0));
  }, [shape]);

  const extrudeSettings = useMemo(() => ({
    steps: 1,
    depth: 0.03,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelOffset: 0,
    bevelSegments: 4
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotation[0] + Math.sin(state.clock.getElapsedTime() * 0.4 + delay) * 0.08;
      meshRef.current.rotation.z = rotation[2] + Math.cos(state.clock.getElapsedTime() * 0.4 + delay) * 0.08;
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 0.6 + delay) * 0.03;
      meshRef.current.scale.set(scale * pulse, scale * pulse, scale * pulse);
    }
  });

  return (
    <group position={position} rotation={rotation} ref={meshRef}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial
        color="#3a6b35" // Более глубокий зеленый
        roughness={0.3}
        metalness={0.1}
        emissive="#1a3d17"
        emissiveIntensity={0.2}
        side={THREE.DoubleSide}
      />
      {/* Линии контура листа для технологичного вида */}
      {leafPoints.length > 0 && (
        <Line
          points={leafPoints}
          color={color}
          lineWidth={1}
          transparent
          opacity={0.5}
        />
      )}
    </group>
  );
};

const Soil = () => {
  return (
    <group position={[0, -0.2, 0]}>
      {/* Основная поверхность земли - более широкая для заполнения кадра */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial
          color="#1a110a"
          roughness={1}
        />
      </mesh>

      {/* Центральный холмик, из которого растет растение */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <circleGeometry args={[2, 32]} />
        <MeshDistortMaterial
          color="#2d1e14"
          roughness={1}
          speed={0}
          distort={0.3}
          radius={1}
        />
      </mesh>
    </group>
  );
};

const Plant = ({ progress, color }: GrowingPlantProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  // Эффект нелинейного роста
  const animatedProgress = Math.pow(progress, 1.3);
  const stemHeight = animatedProgress * 3.8;
  
  // Создаем изогнутый стебель с помощью TubeGeometry
  const { curve, tubePoints } = useMemo(() => {
    const points = [];
    const segments = 32;
    const progressLimit = Math.max(0.01, animatedProgress); // Минимальный прогресс для корректного построения кривой
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = Math.sin(t * Math.PI) * 0.15 * progressLimit;
      const z = Math.cos(t * Math.PI * 0.5) * 0.1 * progressLimit;
      const y = t * stemHeight;
      points.push(new THREE.Vector3(x, y, z));
    }
    try {
      const c = new THREE.CatmullRomCurve3(points);
      return { curve: c, tubePoints: points };
    } catch (e) {
      // Фолбек на прямую линию в случае ошибки
      const fallbackPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, stemHeight || 0.01, 0)];
      return { curve: new THREE.CatmullRomCurve3(fallbackPoints), tubePoints: fallbackPoints };
    }
  }, [animatedProgress, stemHeight]);

  const tubeRef = useRef<THREE.Mesh>(null);
  
  // Убираем проблемный useEffect, так как он пустой по логике и может вызывать ошибки при обращении к геометрии

  const leaves = useMemo(() => {
    const items = [];
    const count = 10; 
    for (let i = 0; i < count; i++) {
      const t = (i / count) * 0.85 + 0.05; // Начинаем чуть ниже
      
      const p = curve.getPoint(t);
      const angle = i * Math.PI * 1.2 + Math.PI * 0.2; // Более спиральное расположение
      
      // Листья раскрываются более нелинейно
      const leafAge = (animatedProgress * 4.5 - t * 4);
      const leafScale = Math.max(0, Math.min(1, leafAge)) * 0.8;
      
      if (leafScale > 0) {
        // Добавляем разнообразие в поворот листьев
        const tilt = Math.PI * 0.2 + (Math.random() - 0.5) * 0.2; // Наклон листа от стебля
        const twist = (Math.random() - 0.5) * 0.5; // Небольшой поворот вокруг оси листа
        
        items.push({
          position: [p.x, p.y, p.z] as [number, number, number],
          rotation: [tilt, angle, twist] as [number, number, number],
          scale: leafScale,
          delay: i * 0.6,
          key: i
        });
      }
    }
    return items;
  }, [animatedProgress, stemHeight, curve]);

  return (
    <group ref={groupRef}>
      {/* Стебель "одним целым" */}
      {animatedProgress > 0.01 && (
        <>
          <mesh ref={tubeRef}>
            <tubeGeometry args={[curve, 48, 0.05, 8, false]} />
            <meshStandardMaterial 
              color="#4e8a47" 
              roughness={0.6}
              emissive="#1a2e16"
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Технологичные линии вдоль стебля */}
          {tubePoints.length > 0 && (
            <Line
              points={tubePoints}
              color={color}
              lineWidth={2}
              transparent
              opacity={0.6}
            />
          )}
        </>
      )}
      
      {/* Листья */}
      {leaves.map((leaf) => (
        <Leaf 
          key={leaf.key}
          position={leaf.position}
          rotation={leaf.rotation}
          scale={leaf.scale}
          color={color}
          delay={leaf.delay}
        />
      ))}
      
      <Soil />
    </group>
  );
};

const GrowingPlant3D = ({ progress, color }: GrowingPlantProps) => {
  return (
    <div className="w-full h-full relative">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2.5, 9], fov: 35 }}>
        {/* Освещение как на фото: контровой свет и мягкий заполняющий */}
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 8, 5]} intensity={2.0} castShadow />
        <spotLight 
          position={[-5, 12, -5]} 
          angle={0.3} 
          penumbra={1} 
          intensity={3.5} 
          color="#ffffff" // Контровой свет (rim light)
        />
        <pointLight position={[0, -2, 5]} intensity={0.8} color="#7cb342" />
        
        <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.15}>
          <Plant progress={progress} color={color} />
        </Float>
        
        <Environment preset="park" />
        
        <Particles color="#8bc34a" count={30} />
      </Canvas>
    </div>
  );
};

const Particles = ({ color, count = 100 }: { color: string, count?: number }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = Math.random() * 5;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      ref.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={points}>
      <PointMaterial
        transparent
        color={color}
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export default GrowingPlant3D;
