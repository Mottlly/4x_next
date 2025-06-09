import React, { useRef } from "react";
import * as THREE from "three";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import getNeighborsAxial from "../../../../../library/utililies/game/tileUtilities/Positioning/getNeighbors";
import { fogStyles } from "@/library/styles/stylesIndex";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

// Import or define the same shader as in FogBestagon
const FogHexShaderMaterial = shaderMaterial(
  { time: 0.0 },
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
    return mix(a, b, u.x)
         + (c - a) * u.y * (1.0 - u.x)
         + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float total = 0.0;
    float amp = 0.5;
    for(int i = 0; i < 5; i++) {
      total += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return total;
  }

  void main() {
    vec2 uv2 = vUv * 4.0;
    uv2 += time * 0.3;
    float f = fbm(uv2);
    vec3 col = mix(vec3(0.15), vec3(0.35), f);
    gl_FragColor = vec4(col, 1.0);
  }
  `
);
extend({ FogHexShaderMaterial });

function getFogTop(tile, heightScale) {
  const fogThickness = fogStyles.geometry.args[2];
  const fogYOffset = 0.01;
  return tile.height * heightScale + 0.25 + fogThickness / 2 + fogYOffset;
}

// Helper: get edge midpoint and direction between two hexes
function getEdgeTransform(q1, r1, q2, r2, spacing) {
  const [x1, , z1] = hexToPosition(q1, r1, spacing);
  const [x2, , z2] = hexToPosition(q2, r2, spacing);
  // Midpoint
  const mx = (x1 + x2) / 2;
  const mz = (z1 + z2) / 2;
  // Angle: rotate so the long axis of the box aligns with the edge
  const angle = Math.atan2(x2 - x1, z2 - z1);
  return { mx, mz, angle };
}

function FogWallLayer({ tiles, spacing, heightScale }) {
  const fogTiles = tiles.filter((t) => !t.discovered);

  const wallSegments = [];
  const seen = new Set();

  fogTiles.forEach((tile) => {
    const { q, r } = tile;
    const neighbors = getNeighborsAxial(q, r);
    neighbors.forEach(({ q: nq, r: nr }) => {
      // Always draw a wall for every edge of a fog tile
      const fogTop1 = getFogTop(tile, heightScale);
      const surfaceY1 = tile.height * heightScale;
      const wallBottom = surfaceY1;
      const wallTop = fogTop1;
      if (wallTop - wallBottom < 0.01) return;
      const wallHeight = wallTop - wallBottom;
      const wallY = wallBottom + wallHeight / 2;
      const { mx, mz, angle } = getEdgeTransform(q, r, nq, nr, spacing);
      wallSegments.push({
        position: [mx, wallY, mz],
        rotation: [0, angle, 0],
        height: wallHeight,
      });
    });
  });

  // Wall thickness and width (match fog's radius for width)
  const thickness = spacing * 0.09;
  const width = spacing * 0.95;

  // Animate the shader time
  const matRef = useRef();
  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.time.value += delta * 0.5;
    }
  });

  return (
    <>
      {wallSegments.map((seg, i) => (
        <mesh
          key={`fogwall-${i}`}
          position={seg.position}
          rotation={seg.rotation}
          renderOrder={fogStyles.renderOrder || 900}
        >
          <boxGeometry args={[width, seg.height, thickness]} />
          <fogHexShaderMaterial ref={matRef} transparent />
        </mesh>
      ))}
    </>
  );
}

export default React.memo(FogWallLayer);
