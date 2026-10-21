import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Cpu, CheckSquare, ShieldAlert, Scale } from 'lucide-react';

interface VerificationNodes3DProps {
  currentStage?: number; // 1 to 5 (defaults to 2 for hero)
  isDark: boolean;
  interactive?: boolean;
}

export const VerificationNodes3D: React.FC<VerificationNodes3DProps> = ({
  currentStage = 2,
  isDark,
}) => {
  // Node coordinates in 3D world space, scaled to fit comfortably inside canvas bounds
  const node1Pos = useMemo(() => new THREE.Vector3(-1.42, 0.78, 0.12), []);
  const node1Doc = useMemo(() => new THREE.Vector3(-0.35, 0.45, 0.05), []);

  const node2Pos = useMemo(() => new THREE.Vector3(-1.42, -0.62, 0.12), []);
  const node2Doc = useMemo(() => new THREE.Vector3(-0.48, -0.64, 0.05), []);

  const node3Pos = useMemo(() => new THREE.Vector3(1.42, 0.78, 0.12), []);
  const node3Doc = useMemo(() => new THREE.Vector3(0.32, 0.26, 0.05), []);

  const node4Pos = useMemo(() => new THREE.Vector3(1.42, -0.62, 0.12), []);
  const node4Doc = useMemo(() => new THREE.Vector3(0.36, -0.12, 0.05), []);

  // Connection line buffer geometries
  const geo1 = useMemo(() => new THREE.BufferGeometry().setFromPoints([node1Pos, node1Doc]), [node1Pos, node1Doc]);
  const geo2 = useMemo(() => new THREE.BufferGeometry().setFromPoints([node2Pos, node2Doc]), [node2Pos, node2Doc]);
  const geo3 = useMemo(() => new THREE.BufferGeometry().setFromPoints([node3Pos, node3Doc]), [node3Pos, node3Doc]);
  const geo4 = useMemo(() => new THREE.BufferGeometry().setFromPoints([node4Pos, node4Doc]), [node4Pos, node4Doc]);

  // Stage active states
  const isNode1Active = currentStage >= 2;
  const isNode2Active = currentStage >= 3 || currentStage === 5;
  const isNode3Active = currentStage >= 3 || currentStage === 5;
  const isNode4Active = currentStage >= 4 || currentStage === 5;

  const activeOpacity = isDark ? 0.75 : 0.65;
  const standbyOpacity = isDark ? 0.15 : 0.12;

  return (
    <group>
      {/* ==================================================== */}
      {/* NODE 1: TEXT EXTRACTION (Top Left)                   */}
      {/* ==================================================== */}
      {/* @ts-expect-error Three line primitive */}
      <line geometry={geo1}>
        <lineBasicMaterial
          color="#38bdf8"
          transparent
          opacity={isNode1Active ? activeOpacity : standbyOpacity}
        />
      </line>

      <group position={node1Pos.toArray()}>
        <mesh>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial
            color={isNode1Active ? '#38bdf8' : (isDark ? '#334155' : '#94a3b8')}
            emissive={isNode1Active ? '#0284c7' : '#000000'}
            emissiveIntensity={isNode1Active ? 1.0 : 0}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>

        <mesh>
          <ringGeometry args={[0.09, 0.11, 24]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={isNode1Active ? 0.7 : 0.2}
          />
        </mesh>

        {/* Crisp 1:1 pixel badge positioned above the node */}
        <Html position={[0, 0.18, 0]} center>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold shadow-md whitespace-nowrap transition-all duration-300 select-none pointer-events-none backdrop-blur-md ${
              isNode1Active
                ? 'bg-sky-500/20 border-sky-400/50 text-sky-700 dark:text-sky-300 ring-1 ring-sky-500/30'
                : 'bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 opacity-60'
            }`}
          >
            <Cpu className="w-3 h-3 text-sky-500 shrink-0" />
            <span>Text Extraction</span>
          </div>
        </Html>
      </group>

      {/* ==================================================== */}
      {/* NODE 2: FIELD VALIDATION (Bottom Left)               */}
      {/* ==================================================== */}
      {/* @ts-expect-error Three line primitive */}
      <line geometry={geo2}>
        <lineBasicMaterial
          color="#818cf8"
          transparent
          opacity={isNode2Active ? activeOpacity : standbyOpacity}
        />
      </line>

      <group position={node2Pos.toArray()}>
        <mesh>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial
            color={isNode2Active ? '#818cf8' : (isDark ? '#334155' : '#94a3b8')}
            emissive={isNode2Active ? '#4f46e5' : '#000000'}
            emissiveIntensity={isNode2Active ? 1.0 : 0}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>

        <mesh>
          <ringGeometry args={[0.09, 0.11, 24]} />
          <meshBasicMaterial
            color="#818cf8"
            transparent
            opacity={isNode2Active ? 0.7 : 0.2}
          />
        </mesh>

        <Html position={[0, -0.18, 0]} center>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold shadow-md whitespace-nowrap transition-all duration-300 select-none pointer-events-none backdrop-blur-md ${
              isNode2Active
                ? 'bg-indigo-500/20 border-indigo-400/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/30'
                : 'bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 opacity-60'
            }`}
          >
            <CheckSquare className="w-3 h-3 text-indigo-500 shrink-0" />
            <span>Field Validation</span>
          </div>
        </Html>
      </group>

      {/* ==================================================== */}
      {/* NODE 3: INTEGRITY ASSESSMENT (Top Right)             */}
      {/* ==================================================== */}
      {/* @ts-expect-error Three line primitive */}
      <line geometry={geo3}>
        <lineBasicMaterial
          color="#34d399"
          transparent
          opacity={isNode3Active ? activeOpacity : standbyOpacity}
        />
      </line>

      <group position={node3Pos.toArray()}>
        <mesh>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial
            color={isNode3Active ? '#34d399' : (isDark ? '#334155' : '#94a3b8')}
            emissive={isNode3Active ? '#059669' : '#000000'}
            emissiveIntensity={isNode3Active ? 1.0 : 0}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>

        <mesh>
          <ringGeometry args={[0.09, 0.11, 24]} />
          <meshBasicMaterial
            color="#34d399"
            transparent
            opacity={isNode3Active ? 0.7 : 0.2}
          />
        </mesh>

        <Html position={[0, 0.18, 0]} center>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold shadow-md whitespace-nowrap transition-all duration-300 select-none pointer-events-none backdrop-blur-md ${
              isNode3Active
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30'
                : 'bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 opacity-60'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>Integrity Signals</span>
          </div>
        </Html>
      </group>

      {/* ==================================================== */}
      {/* NODE 4: COMPLIANCE RULES (Bottom Right)              */}
      {/* ==================================================== */}
      {/* @ts-expect-error Three line primitive */}
      <line geometry={geo4}>
        <lineBasicMaterial
          color="#c084fc"
          transparent
          opacity={isNode4Active ? activeOpacity : standbyOpacity}
        />
      </line>

      <group position={node4Pos.toArray()}>
        <mesh>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial
            color={isNode4Active ? '#c084fc' : (isDark ? '#334155' : '#94a3b8')}
            emissive={isNode4Active ? '#9333ea' : '#000000'}
            emissiveIntensity={isNode4Active ? 1.0 : 0}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>

        <mesh>
          <ringGeometry args={[0.09, 0.11, 24]} />
          <meshBasicMaterial
            color="#c084fc"
            transparent
            opacity={isNode4Active ? 0.7 : 0.2}
          />
        </mesh>

        <Html position={[0, -0.18, 0]} center>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold shadow-md whitespace-nowrap transition-all duration-300 select-none pointer-events-none backdrop-blur-md ${
              isNode4Active
                ? 'bg-purple-500/20 border-purple-400/50 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/30'
                : 'bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 opacity-60'
            }`}
          >
            <Scale className="w-3 h-3 text-purple-500 shrink-0" />
            <span>Compliance Rules</span>
          </div>
        </Html>
      </group>
    </group>
  );
};
