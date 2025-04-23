import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import hexToPosition from "../../../library/utililies/game/tileUtilities/positionFinder";

// Animated fractal fog shader
const FogShaderMaterial = shaderMaterial(
  { time: 0 },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float time;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec2 p) {
      float total = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 6; i++) {
        total += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return total;
    }

    void main() {
      vec2 uv2 = vUv * 10.0;
      // Use time directly; control speed via time increment
      uv2.y += time;
      float f = fbm(uv2);
      vec3 col = mix(vec3(0.9), vec3(0.6), f);
      gl_FragColor = vec4(col, 0.8);
    }
  `
);
extend({ FogShaderMaterial });

/**
 * Renders a fogged floor plane far beyond the board extents.
 * Controls fog speed via `speed` prop (lower = slower).
 */
export default function FogEnclosure({
  board,
  spacing,
  margin = 5,
  heightScale = 0.5,
  floorFactor = 10,
  speed = 0.02,
}) {
  const floorRef = useRef();

  // Compute board bounds and water heights
  let minX = Infinity,
    maxX = -Infinity;
  let minZ = Infinity,
    maxZ = -Infinity;
  const waterHeights = [];

  board.tiles.forEach(({ q, r, height, type }) => {
    const [x, , z] = hexToPosition(q, r, spacing);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minZ = Math.min(minZ, z);
    maxZ = Math.max(maxZ, z);
    if (type === "water") {
      waterHeights.push(height * heightScale);
    }
  });

  // Floor positioned just below the lowest water tile
  const minWaterY = waterHeights.length ? Math.min(...waterHeights) : 0;
  const floorY = minWaterY - 0.1;

  // Base extents with margin
  const baseWidth = maxX - minX + 2 * margin;
  const baseDepth = maxZ - minZ + 2 * margin;
  // Extend floor far beyond board
  const width = baseWidth * floorFactor;
  const depth = baseDepth * floorFactor;

  // Keep it centered on the board
  const centerX = (minX + maxX) / 2;
  const centerZ = (minZ + maxZ) / 2;

  // Animate the fog shader over time, scaled by `speed`
  useFrame((_, delta) => {
    if (floorRef.current?.material?.uniforms) {
      floorRef.current.material.uniforms.time.value += delta * speed;
    }
  });

  return (
    <mesh
      ref={floorRef}
      position={[centerX, floorY, centerZ]}
      rotation={[-Math.PI / 2, 0, 0]}
      renderOrder={999}
    >
      <planeGeometry args={[width, depth]} />
      <fogShaderMaterial transparent />
    </mesh>
  );
}
