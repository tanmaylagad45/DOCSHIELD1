import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { Hero3DFallback } from './Hero3DFallback';
import { Cpu, Scale, CheckCircle2 } from 'lucide-react';

// Verification Shield 3D Geometry
function ShieldMesh() {
  const shieldShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.8);
    shape.quadraticCurveTo(0.6, 0.75, 0.6, 0.2);
    shape.quadraticCurveTo(0.6, -0.4, 0, -0.8);
    shape.quadraticCurveTo(-0.6, -0.4, -0.6, 0.2);
    shape.quadraticCurveTo(-0.6, 0.75, 0, 0.8);
    return shape;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.15,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    }),
    []
  );

  return (
    <mesh position={[0.2, 0.05, 0.4]} scale={0.9}>
      <extrudeGeometry args={[shieldShape, extrudeSettings]} />
      <meshStandardMaterial
        color="#0284c7"
        metalness={0.7}
        roughness={0.25}
        emissive="#0369a1"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

// Scanning Beam Sweep
function ScannerBeam() {
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (beamRef.current) {
      beamRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.8) * 0.75;
    }
  });

  return (
    <mesh ref={beamRef} position={[0, 0, 0.05]}>
      <boxGeometry args={[2.8, 0.03, 0.01]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
    </mesh>
  );
}

// Document Panel with Abstract Data Fields
function DocumentPanel() {
  return (
    <group position={[-0.1, 0, -0.2]} rotation={[-0.05, 0.15, -0.02]}>
      {/* Base Document Slab */}
      <mesh>
        <boxGeometry args={[3.0, 2.0, 0.06]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.4}
          metalness={0.1}
          transparent
          opacity={0.95}
        />
        <Edges color="#cbd5e1" threshold={15} />
      </mesh>

      {/* Abstract Photo placeholder */}
      <mesh position={[-0.95, 0.35, 0.04]}>
        <planeGeometry args={[0.65, 0.8]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      {/* Abstract Text Bars */}
      <mesh position={[0.25, 0.55, 0.04]}>
        <planeGeometry args={[1.4, 0.1]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[0.1, 0.35, 0.04]}>
        <planeGeometry args={[1.1, 0.08]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <mesh position={[0.2, 0.15, 0.04]}>
        <planeGeometry args={[1.3, 0.08]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      {/* MRZ Strip */}
      <mesh position={[0, -0.65, 0.04]}>
        <planeGeometry args={[2.7, 0.25]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      {/* Animated Scanner */}
      <ScannerBeam />
    </group>
  );
}

// Connecting Lines and Analysis Nodes
function ConnectingNodes() {
  const linePoints1 = useMemo(() => [new THREE.Vector3(-1.3, 0.7, 0.2), new THREE.Vector3(0.2, 0.2, 0.4)], []);
  const linePoints2 = useMemo(() => [new THREE.Vector3(1.4, 0.5, 0.1), new THREE.Vector3(0.2, 0.0, 0.4)], []);
  const linePoints3 = useMemo(() => [new THREE.Vector3(-1.1, -0.6, 0.2), new THREE.Vector3(0.2, -0.2, 0.4)], []);

  const lineGeo1 = useMemo(() => new THREE.BufferGeometry().setFromPoints(linePoints1), [linePoints1]);
  const lineGeo2 = useMemo(() => new THREE.BufferGeometry().setFromPoints(linePoints2), [linePoints2]);
  const lineGeo3 = useMemo(() => new THREE.BufferGeometry().setFromPoints(linePoints3), [linePoints3]);

  return (
    <group>
      {/* Node 1: Top Left (OCR) */}
      <mesh position={[-1.3, 0.7, 0.2]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
      </mesh>
      {/* @ts-expect-error Three line primitive */}
      <line geometry={lineGeo1}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.4} />
      </line>

      {/* Node 2: Top Right (Rules) */}
      <mesh position={[1.4, 0.5, 0.1]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#818cf8" emissive="#4f46e5" emissiveIntensity={0.6} />
      </mesh>
      {/* @ts-expect-error Three line primitive */}
      <line geometry={lineGeo2}>
        <lineBasicMaterial color="#818cf8" transparent opacity={0.4} />
      </line>

      {/* Node 3: Bottom Left (Checksum) */}
      <mesh position={[-1.1, -0.6, 0.2]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#34d399" emissive="#059669" emissiveIntensity={0.6} />
      </mesh>
      {/* @ts-expect-error Three line primitive */}
      <line geometry={lineGeo3}>
        <lineBasicMaterial color="#34d399" transparent opacity={0.4} />
      </line>
    </group>
  );
}

// Main Interactive Floating Rig
function SceneRig() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Gentle floating breathing animation
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.08;

    // Subtle pointer parallax tracking
    const targetRotX = (state.pointer.y * 0.12);
    const targetRotY = (state.pointer.x * 0.18);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
  });

  return (
    <group ref={groupRef}>
      <DocumentPanel />
      <ShieldMesh />
      <ConnectingNodes />

      {/* 3D Floating HTML Badges */}
      <Html position={[-1.6, 0.95, 0.3]} center distanceFactor={7}>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-md text-[10px] font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap backdrop-blur-xs select-none pointer-events-none">
          <Cpu className="w-3 h-3 text-sky-500" />
          <span>OCR: 99.4%</span>
        </div>
      </Html>

      <Html position={[1.5, 0.8, 0.2]} center distanceFactor={7}>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-md text-[10px] font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap backdrop-blur-xs select-none pointer-events-none">
          <Scale className="w-3 h-3 text-indigo-500" />
          <span>Rule: KYC-18+</span>
        </div>
      </Html>

      <Html position={[0.2, -0.9, 0.6]} center distanceFactor={7}>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 shadow-md text-[10px] font-bold text-emerald-700 dark:text-emerald-300 whitespace-nowrap backdrop-blur-xs select-none pointer-events-none">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Multi-Signal Verified</span>
        </div>
      </Html>
    </group>
  );
}

// Error Boundary for WebGL initialization
class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const Hero3DScene: React.FC = () => {
  const [canRenderWebGL, setCanRenderWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCanRenderWebGL(false);
      return;
    }

    // Check WebGL context availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setCanRenderWebGL(!!gl);
    } catch {
      setCanRenderWebGL(false);
    }
  }, []);

  if (canRenderWebGL === false) {
    return <Hero3DFallback reason="Reduced motion or WebGL fallback active" />;
  }

  return (
    <div className="relative w-full aspect-4/3 max-w-lg mx-auto flex items-center justify-center">
      <WebGLErrorBoundary fallback={<Hero3DFallback reason="WebGL rendering error" />}>
        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[4, 5, 4]} intensity={1.2} />
          <pointLight position={[0.2, 0.5, 1.5]} intensity={1.5} color="#38bdf8" />
          <SceneRig />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
};
