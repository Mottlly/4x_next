import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";

// Individual storage crate component
function StorageCrate({ position, scale = 1, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main crate body */}
      <mesh>
        <boxGeometry args={[0.3, 0.2, 0.3]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Control panel */}
      <mesh position={[0, 0.05, 0.16]}>
        <boxGeometry args={[0.12, 0.06, 0.02]} />
        <meshStandardMaterial
          color="#6fa54a"
          emissive="#2a4a1a"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Warning stripes */}
      <mesh position={[0, -0.05, 0.16]}>
        <boxGeometry args={[0.2, 0.02, 0.02]} />
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ff6600"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

// Pulsing arrow pointing down
function PulsingArrow() {
  const arrowRef = useRef();

  // Animation for pulsing effect
  const { scale, opacity } = useSpring({
    from: { scale: 1, opacity: 0.6 },
    to: async (next) => {
      while (true) {
        await next({ scale: 1.2, opacity: 1 });
        await next({ scale: 1, opacity: 0.6 });
      }
    },
    config: { duration: 1000 },
  });

  // Floating animation
  useFrame((state) => {
    if (arrowRef.current) {
      arrowRef.current.position.y =
        3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      arrowRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <a.group ref={arrowRef} scale={scale}>
      {/* Arrow shaft */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.5, 8]} />
        <a.meshStandardMaterial
          color="#ffdd00"
          emissive="#ffaa00"
          emissiveIntensity={0.4}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Arrow head pointing down */}
      <mesh position={[0, -0.9, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.2, 0.4, 8]} />
        <a.meshStandardMaterial
          color="#ffdd00"
          emissive="#ffaa00"
          emissiveIntensity={0.4}
          transparent
          opacity={opacity}
        />
      </mesh>
    </a.group>
  );
}

export default function GoodyHut({
  position = [0, 0, 0],
  scale = 1,
  rotation = 0,
}) {
  return (
    <group position={position} scale={scale} rotation={[0, rotation, 0]}>
      {/* Storage crates arranged side by side */}
      <StorageCrate
        position={[-0.2, -0.3, 0.2]}
        scale={1}
        rotation={[0, 0, 0]}
      />
      <StorageCrate
        position={[0.2, -0.3, 0]}
        scale={1}
        rotation={[0, Math.PI / 3, 0]}
      />
      <StorageCrate
        position={[0, -0.3, -0.25]}
        scale={0.9}
        rotation={[0, -Math.PI / 6, 0]}
      />

      {/* Pulsing arrow pointing down from the sky */}
      <PulsingArrow />
    </group>
  );
}
