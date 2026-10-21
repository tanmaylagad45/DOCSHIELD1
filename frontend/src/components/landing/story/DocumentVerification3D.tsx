import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../../context/ThemeContext';
import { DocumentVerificationSpecimen } from '../3d/DocumentVerificationSpecimen';
import { VerificationNodes3D } from '../3d/VerificationNodes3D';
import { ResultDossierPreview } from '../3d/ResultDossierPreview';

interface DocumentVerification3DProps {
  currentStage: number; // 1 to 5
}

export const DocumentVerification3D: React.FC<DocumentVerification3DProps> = ({ currentStage }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const rigRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!rigRef.current) return;

    // Stage-specific camera / rig choreography
    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    switch (currentStage) {
      case 1:
        targetX = 0;
        targetY = 0;
        targetZ = 0;
        targetRotX = -0.02;
        targetRotY = 0.06;
        break;
      case 2:
        targetX = 0;
        targetY = 0.03;
        targetZ = 0.06;
        targetRotX = -0.04;
        targetRotY = 0.14;
        break;
      case 3:
        targetX = 0.04;
        targetY = -0.02;
        targetZ = 0.04;
        targetRotX = 0.05;
        targetRotY = -0.16;
        break;
      case 4:
        targetX = -0.04;
        targetY = 0.05;
        targetZ = 0.06;
        targetRotX = -0.03;
        targetRotY = 0.1;
        break;
      case 5:
        targetX = 0;
        targetY = 0.02;
        targetZ = 0.12;
        targetRotX = 0;
        targetRotY = 0.03;
        break;
      default:
        break;
    }

    // Subtle pointer parallax tracking
    const parallaxX = state.pointer.x * 0.07;
    const parallaxY = state.pointer.y * 0.05;

    // Barely perceptible idle floating breathing
    const breathing = Math.sin(state.clock.elapsedTime * 0.9) * 0.025;

    rigRef.current.position.x = THREE.MathUtils.lerp(rigRef.current.position.x, targetX, 0.05);
    rigRef.current.position.y = THREE.MathUtils.lerp(rigRef.current.position.y, targetY + breathing, 0.05);
    rigRef.current.position.z = THREE.MathUtils.lerp(rigRef.current.position.z, targetZ, 0.05);

    rigRef.current.rotation.x = THREE.MathUtils.lerp(rigRef.current.rotation.x, targetRotX + parallaxY, 0.05);
    rigRef.current.rotation.y = THREE.MathUtils.lerp(rigRef.current.rotation.y, targetRotY + parallaxX, 0.05);
  });

  return (
    <>
      {/* Precision Scientific Verification Lighting */}
      <ambientLight intensity={isDark ? 0.95 : 1.3} />
      
      <directionalLight
        position={[4, 5, 4]}
        intensity={isDark ? 1.5 : 1.3}
        color={isDark ? '#e0f2fe' : '#ffffff'}
      />

      <pointLight
        position={[-3, 0.5, 2.5]}
        intensity={isDark ? 1.4 : 1.0}
        color="#38bdf8"
      />

      <pointLight
        position={[0, -2, 1.5]}
        intensity={isDark ? 0.6 : 0.4}
        color="#818cf8"
      />

      <group ref={rigRef}>
        {/* Layer A & B: Dimensional Specimen + Precision Chamber */}
        <DocumentVerificationSpecimen
          currentStage={currentStage}
          isDark={isDark}
          scanActive={currentStage >= 2}
        />

        {/* Layer C: 4 Connected Intelligence Nodes */}
        <VerificationNodes3D
          currentStage={currentStage}
          isDark={isDark}
        />

        {/* Layer D: Compact Explainable Assessment Dossier (Stage 5) */}
        {currentStage === 5 && (
          <ResultDossierPreview isDark={isDark} />
        )}
      </group>
    </>
  );
};
