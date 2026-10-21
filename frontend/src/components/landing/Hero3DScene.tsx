import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { DocumentVerificationSpecimen } from './3d/DocumentVerificationSpecimen';
import { Hero3DFallback } from './Hero3DFallback';
import { Cpu, ShieldCheck } from 'lucide-react';

// Cinematic Pointer Parallax & Subtle Idle Breathing
function HeroChamberRig({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Barely perceptible, calm idle breathing
    const t = state.clock.getElapsedTime();
    const idleY = Math.sin(t * 0.9) * 0.03;

    // Smooth, restrained pointer parallax tracking
    const targetRotX = state.pointer.y * 0.05;
    const targetRotY = state.pointer.x * 0.07;

    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, idleY, 0.04);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.04);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.04);
  });

  return (
    <group ref={groupRef}>
      {/* Signature 3D Fictional Document floating in Verification Chamber */}
      <DocumentVerificationSpecimen currentStage={2} isDark={isDark} scanActive={true} scale={0.78} />

      {/* Subtle supplementary indicator 1: Compact Extraction Beacon */}
      <group position={[-1.2, 1.12, 0.35]}>
        <mesh>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.2}
          />
        </mesh>
        <Html position={[0, 0.18, 0]} center>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-sky-400/40 bg-sky-500/15 text-sky-700 dark:text-sky-300 text-[9.5px] font-semibold tracking-wide backdrop-blur-md shadow-sm select-none pointer-events-none whitespace-nowrap">
            <Cpu className="w-3 h-3 text-sky-500" />
            <span>Structured Extraction</span>
          </div>
        </Html>
      </group>

      {/* Subtle supplementary indicator 2: Compact Integrity & Compliance Beacon */}
      <group position={[1.2, 1.12, 0.15]}>
        <mesh>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={1.2}
          />
        </mesh>
        <Html position={[0, 0.18, 0]} center>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-400/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[9.5px] font-semibold tracking-wide backdrop-blur-md shadow-sm select-none pointer-events-none whitespace-nowrap">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Integrity Verified</span>
          </div>
        </Html>
      </group>
    </group>
  );
}

// WebGL Initialization Error Boundary
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [canRenderWebGL, setCanRenderWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCanRenderWebGL(false);
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setCanRenderWebGL(!!gl);
    } catch {
      setCanRenderWebGL(false);
    }
  }, []);

  if (canRenderWebGL === false) {
    return <Hero3DFallback reason="Standard high-performance mode active" />;
  }

  return (
    <div className="relative w-full h-[460px] sm:h-[500px] lg:h-[560px] flex items-center justify-center select-none">
      {/* Soft atmospheric radial backlight glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl opacity-40 dark:opacity-50 transition-opacity"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 50% 50%, rgba(2, 132, 199, 0.16) 0%, rgba(14, 165, 233, 0.04) 55%, transparent 75%)'
            : 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.16) 0%, rgba(2, 132, 199, 0.04) 55%, transparent 75%)',
        }}
      />

      <WebGLErrorBoundary fallback={<Hero3DFallback reason="WebGL rendering error" />}>
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 42 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full"
        >
          {/* Scientific Verification Chamber Lighting */}
          <ambientLight intensity={isDark ? 0.95 : 1.3} />
          
          {/* Key Light giving crisp edge highlights across the beveled document */}
          <directionalLight
            position={[4, 5, 4]}
            intensity={isDark ? 1.5 : 1.3}
            color={isDark ? '#e0f2fe' : '#ffffff'}
          />

          {/* Cool Cyan Rim Light highlighting card thickness */}
          <pointLight
            position={[-3, 0.5, 2.5]}
            intensity={isDark ? 1.4 : 1.0}
            color="#38bdf8"
          />

          {/* Precision floor bounce fill */}
          <pointLight
            position={[0, -2, 1.5]}
            intensity={isDark ? 0.6 : 0.4}
            color="#818cf8"
          />

          <HeroChamberRig isDark={isDark} />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
};
