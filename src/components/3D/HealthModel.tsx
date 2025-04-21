import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box } from '@react-three/drei';
import { Group } from 'three';

const HealthModel = () => {
  const groupRef = useRef<Group>(null);
  const elapsedTimeRef = useRef(0); // Track elapsed time

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      elapsedTimeRef.current = state.clock.getElapsedTime(); // Update elapsed time in ref
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main sphere representing health */}
      <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#a855f7" metalness={0.5} roughness={0.2} />
      </Sphere>

      {/* Orbiting elements */}
      <group>
        {[0, Math.PI * 0.5, Math.PI, Math.PI * 1.5].map((angle, index) => (
          <Box
            key={index}
            args={[0.2, 0.2, 0.2]}
            position={[
              Math.cos(angle) * 2,
              Math.sin(elapsedTimeRef.current * 0.5) * 0.5, // Use the elapsed time from ref
              Math.sin(angle) * 2,
            ]}
          >
            <meshStandardMaterial color="#e9d5ff" metalness={0.8} roughness={0.2} />
          </Box>
        ))}
      </group>
    </group>
  );
};

export default HealthModel;
