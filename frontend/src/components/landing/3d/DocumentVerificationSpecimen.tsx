import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';

interface DocumentVerificationSpecimenProps {
  currentStage?: number; // 1 to 5
  isDark: boolean;
  scanActive?: boolean;
  scale?: number;
}

// 1. Precision Verification Chamber - Back Chassis & Light Guides
function ChamberChassis({ isDark, currentStage }: { isDark: boolean; currentStage: number }) {
  // Chamber chassis plate with fine geometric bevel
  const chassisShape = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 2.1;
    const h = 1.5;
    const r = 0.12;
    shape.moveTo(-w + r, -h);
    shape.lineTo(w - r, -h);
    shape.quadraticCurveTo(w, -h, w, -h + r);
    shape.lineTo(w, h - r);
    shape.quadraticCurveTo(w, h, w - r, h);
    shape.lineTo(-w + r, h);
    shape.quadraticCurveTo(-w, h, -w, h - r);
    shape.lineTo(-w, -h + r);
    shape.quadraticCurveTo(-w, -h, -w + r, -h);
    return shape;
  }, []);

  const chassisSettings = useMemo(
    () => ({
      depth: 0.05,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    }),
    []
  );

  const glowIntensity = currentStage >= 3 ? (isDark ? 0.35 : 0.18) : (isDark ? 0.18 : 0.08);

  return (
    <group position={[0, 0, -0.35]}>
      {/* Precision Chamber Backplate */}
      <mesh>
        <extrudeGeometry args={[chassisShape, chassisSettings]} />
        <meshPhysicalMaterial
          color={isDark ? '#060d1f' : '#f1f5f9'}
          emissive={isDark ? '#0284c7' : '#38bdf8'}
          emissiveIntensity={glowIntensity}
          roughness={0.25}
          metalness={0.5}
          transmission={0.4}
          transparent
          opacity={isDark ? 0.45 : 0.25}
          thickness={0.4}
        />
        <Edges color={isDark ? '#1e3a5f' : '#cbd5e1'} threshold={20} />
      </mesh>

      {/* Outer Luminous Calibration Ring */}
      <mesh position={[0, 0, -0.01]}>
        <ringGeometry args={[2.25, 2.26, 64]} />
        <meshBasicMaterial
          color={isDark ? '#38bdf8' : '#0284c7'}
          transparent
          opacity={isDark ? 0.25 : 0.15}
        />
      </mesh>

      {/* Chamber Corner Light Guides (4 Precision Cylinders) */}
      {[
        [-1.98, 1.38],
        [1.98, 1.38],
        [-1.98, -1.38],
        [1.98, -1.38],
      ].map(([x, y], idx) => (
        <group key={idx} position={[x, y, 0.08]}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.12, 16]} />
            <meshStandardMaterial
              color={isDark ? '#38bdf8' : '#0284c7'}
              emissive={isDark ? '#38bdf8' : '#0284c7'}
              emissiveIntensity={0.8}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 2. Precision Corner Targeting Brackets
function PrecisionReticles({ isDark }: { isDark: boolean }) {
  const reticleColor = isDark ? '#38bdf8' : '#0284c7';
  const reticleOpacity = isDark ? 0.85 : 0.65;

  const bracketGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0.25, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.25, 0, 0),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  return (
    <group position={[0, 0, 0.07]}>
      {/* Top-Left */}
      <group position={[-1.76, 1.18, 0]}>
        {/* @ts-expect-error Three line primitive */}
        <line geometry={bracketGeo}>
          <lineBasicMaterial color={reticleColor} transparent opacity={reticleOpacity} linewidth={2} />
        </line>
      </group>

      {/* Top-Right */}
      <group position={[1.76, 1.18, 0]} rotation={[0, 0, -Math.PI / 2]}>
        {/* @ts-expect-error Three line primitive */}
        <line geometry={bracketGeo}>
          <lineBasicMaterial color={reticleColor} transparent opacity={reticleOpacity} linewidth={2} />
        </line>
      </group>

      {/* Bottom-Right */}
      <group position={[1.76, -1.18, 0]} rotation={[0, 0, Math.PI]}>
        {/* @ts-expect-error Three line primitive */}
        <line geometry={bracketGeo}>
          <lineBasicMaterial color={reticleColor} transparent opacity={reticleOpacity} linewidth={2} />
        </line>
      </group>

      {/* Bottom-Left */}
      <group position={[-1.76, -1.18, 0]} rotation={[0, 0, Math.PI / 2]}>
        {/* @ts-expect-error Three line primitive */}
        <line geometry={bracketGeo}>
          <lineBasicMaterial color={reticleColor} transparent opacity={reticleOpacity} linewidth={2} />
        </line>
      </group>
    </group>
  );
}

// 3. Razor-Thin Sweeping Optical Scanning Laser
function OpticalScanningPlane({ isScanning = true }: { isScanning: boolean }) {
  const laserRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (laserRef.current && isScanning) {
      // Smooth vertical sweep across the card [-0.95, 0.95]
      laserRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.8) * 0.95;
    }
  });

  return (
    <group ref={laserRef} position={[0, 0, 0.08]}>
      {/* High-intensity laser beam line */}
      <mesh>
        <boxGeometry args={[3.36, 0.016, 0.008]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Soft optical beam reflection bloom */}
      <mesh position={[0, 0, -0.004]}>
        <planeGeometry args={[3.38, 0.1]} />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// 4. Main Dimensional Document Specimen
export const DocumentVerificationSpecimen: React.FC<DocumentVerificationSpecimenProps> = ({
  currentStage = 2,
  isDark,
  scanActive = true,
  scale = 0.86,
}) => {
  // Cohesive material tokens
  const slabColor = isDark ? '#080f22' : '#ffffff';
  const slabEdgeColor = isDark ? '#1e3860' : '#cbd5e1';
  const rimHighlight = isDark ? '#38bdf8' : '#0284c7';
  const primaryTextColor = isDark ? '#94a3b8' : '#475569';
  const highlightCyan = '#38bdf8';
  const highlightEmerald = '#10b981';
  const highlightPurple = '#c084fc';
  const photoPlateBg = isDark ? '#0f1b36' : '#f1f5f9';
  const microchipGold = '#d97706';

  const isTextActive = currentStage >= 2;
  const isIntegrityActive = currentStage >= 3;
  const isComplianceActive = currentStage >= 4;

  return (
    // Three-quarter perspective angle to show physical depth and layered edges
    <group position={[0, 0, 0]} rotation={[-0.06, 0.2, -0.02]} scale={scale}>
      
      {/* Verification Chamber Chassis & Light Guides */}
      <ChamberChassis isDark={isDark} currentStage={currentStage} />

      {/* Layer A: Base Dimensional Specimen Slab */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.35, 2.22, 0.08]} />
        <meshPhysicalMaterial
          color={slabColor}
          metalness={0.15}
          roughness={0.2}
          clearcoat={0.4}
          clearcoatRoughness={0.12}
          reflectivity={0.6}
          transparent
          opacity={0.98}
        />
        <Edges color={slabEdgeColor} threshold={15} />
      </mesh>

      {/* Specimen Header Strip */}
      <mesh position={[0, 0.9, 0.043]}>
        <planeGeometry args={[3.1, 0.22]} />
        <meshStandardMaterial
          color={isDark ? '#0d1830' : '#f8fafc'}
          metalness={0.2}
          roughness={0.4}
        />
        <Edges color={isDark ? '#1e293b' : '#e2e8f0'} />
      </mesh>

      {/* Precision Gold Microchip Contact Pad */}
      <group position={[-1.3, 0.9, 0.048]}>
        <mesh>
          <planeGeometry args={[0.26, 0.15]} />
          <meshStandardMaterial color={microchipGold} metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.002]}>
          <boxGeometry args={[0.015, 0.13, 0.001]} />
          <meshBasicMaterial color="#78350f" />
        </mesh>
        <mesh position={[0, 0, 0.002]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.015, 0.22, 0.001]} />
          <meshBasicMaterial color="#78350f" />
        </mesh>
      </group>

      {/* Header Fictional Title Bars */}
      <mesh position={[-0.2, 0.94, 0.048]}>
        <planeGeometry args={[1.65, 0.04]} />
        <meshBasicMaterial color={isDark ? '#64748b' : '#94a3b8'} />
      </mesh>
      <mesh position={[-0.38, 0.86, 0.048]}>
        <planeGeometry args={[1.25, 0.03]} />
        <meshBasicMaterial color={isDark ? '#475569' : '#cbd5e1'} />
      </mesh>

      {/* Header Status Tag */}
      <mesh position={[1.18, 0.9, 0.048]}>
        <planeGeometry args={[0.6, 0.1]} />
        <meshBasicMaterial color={isTextActive ? highlightCyan : (isDark ? '#334155' : '#cbd5e1')} />
      </mesh>

      {/* Portrait Identity Window (Left Side) */}
      <group position={[-1.02, 0.18, 0.043]}>
        {/* Recessed Photo Plate */}
        <mesh>
          <planeGeometry args={[0.88, 1.1]} />
          <meshStandardMaterial color={photoPlateBg} metalness={0.1} roughness={0.6} />
          <Edges color={isIntegrityActive ? highlightEmerald : (isDark ? '#1e3860' : '#cbd5e1')} />
        </mesh>

        {/* Head Silhouette */}
        <mesh position={[0, 0.19, 0.008]}>
          <circleGeometry args={[0.19, 24]} />
          <meshBasicMaterial color={isDark ? '#334155' : '#94a3b8'} />
        </mesh>

        {/* Torso Silhouette */}
        <mesh position={[0, -0.23, 0.008]}>
          <planeGeometry args={[0.6, 0.34]} />
          <meshBasicMaterial color={isDark ? '#334155' : '#94a3b8'} />
        </mesh>

        {/* Holographic Security Overlay Ring */}
        <mesh position={[0, 0, 0.012]}>
          <ringGeometry args={[0.28, 0.3, 32]} />
          <meshBasicMaterial
            color={isIntegrityActive ? highlightEmerald : rimHighlight}
            transparent
            opacity={isIntegrityActive ? 0.85 : 0.35}
          />
        </mesh>
      </group>

      {/* Structured Fictional Identity Fields (Right Side) */}
      {/* Field 1: Full Name Entity */}
      <group position={[0.45, 0.52, 0.045]}>
        <mesh position={[-0.52, 0.065, 0]}>
          <planeGeometry args={[0.42, 0.03]} />
          <meshBasicMaterial color={isDark ? '#475569' : '#94a3b8'} />
        </mesh>
        <mesh position={[0, -0.01, 0]}>
          <planeGeometry args={[1.46, 0.095]} />
          <meshStandardMaterial
            color={isTextActive ? highlightCyan : primaryTextColor}
            emissive={isTextActive ? '#0284c7' : '#000000'}
            emissiveIntensity={isTextActive ? 0.6 : 0}
          />
        </mesh>
      </group>

      {/* Field 2: Document Number / Specimen ID */}
      <group position={[0.45, 0.3, 0.045]}>
        <mesh position={[-0.48, 0.06, 0]}>
          <planeGeometry args={[0.48, 0.028]} />
          <meshBasicMaterial color={isDark ? '#475569' : '#94a3b8'} />
        </mesh>
        <mesh position={[-0.1, -0.01, 0]}>
          <planeGeometry args={[1.24, 0.08]} />
          <meshStandardMaterial
            color={isTextActive ? highlightCyan : primaryTextColor}
            emissive={isTextActive ? '#0284c7' : '#000000'}
            emissiveIntensity={isTextActive ? 0.45 : 0}
          />
        </mesh>
      </group>

      {/* Field 3: Date of Birth & Legal Age */}
      <group position={[0.45, 0.08, 0.045]}>
        <mesh position={[-0.54, 0.06, 0]}>
          <planeGeometry args={[0.38, 0.028]} />
          <meshBasicMaterial color={isDark ? '#475569' : '#94a3b8'} />
        </mesh>
        <mesh position={[-0.2, -0.01, 0]}>
          <planeGeometry args={[1.06, 0.08]} />
          <meshStandardMaterial
            color={isComplianceActive ? highlightPurple : primaryTextColor}
            emissive={isComplianceActive ? '#9333ea' : '#000000'}
            emissiveIntensity={isComplianceActive ? 0.55 : 0}
          />
        </mesh>
      </group>

      {/* Field 4: Expiration Date & Validity Interval */}
      <group position={[0.45, -0.14, 0.045]}>
        <mesh position={[-0.5, 0.06, 0]}>
          <planeGeometry args={[0.46, 0.028]} />
          <meshBasicMaterial color={isDark ? '#475569' : '#94a3b8'} />
        </mesh>
        <mesh position={[-0.14, -0.01, 0]}>
          <planeGeometry args={[1.18, 0.08]} />
          <meshStandardMaterial
            color={isComplianceActive ? highlightPurple : primaryTextColor}
            emissive={isComplianceActive ? '#9333ea' : '#000000'}
            emissiveIntensity={isComplianceActive ? 0.65 : 0}
          />
        </mesh>
      </group>

      {/* Field 5: Authority / Issuing Code */}
      <group position={[0.45, -0.34, 0.045]}>
        <mesh position={[-0.56, 0.05, 0]}>
          <planeGeometry args={[0.34, 0.025]} />
          <meshBasicMaterial color={isDark ? '#475569' : '#94a3b8'} />
        </mesh>
        <mesh position={[-0.24, -0.01, 0]}>
          <planeGeometry args={[0.98, 0.07]} />
          <meshStandardMaterial color={primaryTextColor} />
        </mesh>
      </group>

      {/* Machine Readable Zone (MRZ) Optical Band */}
      <group position={[0, -0.74, 0.043]}>
        <mesh>
          <planeGeometry args={[3.1, 0.35]} />
          <meshStandardMaterial
            color={isDark ? '#050a16' : '#f8fafc'}
            metalness={0.1}
            roughness={0.8}
          />
          <Edges color={isIntegrityActive ? highlightCyan : (isDark ? '#1e293b' : '#e2e8f0')} />
        </mesh>

        <mesh position={[0, 0.065, 0.005]}>
          <planeGeometry args={[2.85, 0.055]} />
          <meshBasicMaterial
            color={isIntegrityActive ? highlightCyan : (isDark ? '#64748b' : '#94a3b8')}
          />
        </mesh>

        <mesh position={[0, -0.065, 0.005]}>
          <planeGeometry args={[2.8, 0.055]} />
          <meshBasicMaterial
            color={isIntegrityActive ? highlightEmerald : (isDark ? '#64748b' : '#94a3b8')}
          />
        </mesh>
      </group>

      {/* Precision Reticles & Corner Light Guides */}
      <PrecisionReticles isDark={isDark} />

      {/* Optical Sweeping Scanning Plane */}
      {scanActive && <OpticalScanningPlane isScanning={scanActive} />}
    </group>
  );
};
