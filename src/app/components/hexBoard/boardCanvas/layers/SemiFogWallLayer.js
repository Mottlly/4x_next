import React, { useRef } from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import getNeighborsAxial from "../../../../../library/utililies/game/tileUtilities/Positioning/getNeighbors";
import { semiFogStyles } from "@/library/styles/stylesIndex";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

// Shader: copy from SemiFogBestagon (lower alpha)
const SemiFogHexShaderMaterial = shaderMaterial(
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
    gl_FragColor = vec4(col, 0.4); // Lower alpha for semi-fog
  }
  `
);
extend({ SemiFogHexShaderMaterial });

function getSemiFogTop(tile, heightScale) {
  const fogThickness = semiFogStyles.geometry.args[2];
  const fogYOffset = 0.3;
  return tile.height * heightScale + fogYOffset + fogThickness / 2;
}

function getEdgeTransform(q1, r1, q2, r2, spacing) {
  const [x1, , z1] = hexToPosition(q1, r1, spacing);
  const [x2, , z2] = hexToPosition(q2, r2, spacing);
  const mx = (x1 + x2) / 2;
  const mz = (z1 + z2) / 2;
  const angle = Math.atan2(x2 - x1, z2 - z1);
  return { mx, mz, angle };
}

function SemiFogWallLayer({ tiles, spacing, heightScale }) {
  const semiFogTiles = tiles.filter((t) => t.semiFogged);

  const wallSegments = [];
  const seen = new Set();

  semiFogTiles.forEach((tile) => {
    const { q, r } = tile;
    const neighbors = getNeighborsAxial(q, r);
    neighbors.forEach(({ q: nq, r: nr }) => {
      const neighbor = tiles.find((t) => t.q === nq && t.r === nr);

      // 1. Wall between semi-fog and full fog (if full fog is lower)
      if (neighbor && !neighbor.discovered && !neighbor.semiFogged) {
        const fogTop1 = getSemiFogTop(tile, heightScale);
        const fogTop2 =
          neighbor.height * heightScale +
          semiFogStyles.geometry.args[2] / 2 +
          0.01; // top of full fog
        if (fogTop2 < fogTop1 - 0.01) {
          // Only if full fog is lower
          const wallHeight = fogTop1 - fogTop2;
          const wallY = fogTop2 + wallHeight / 2;
          const { mx, mz, angle } = getEdgeTransform(q, r, nq, nr, spacing);
          wallSegments.push({
            position: [mx, wallY, mz],
            rotation: [0, angle, 0],
            height: wallHeight,
          });
        }
      }

      // 2. Wall between semi-fog tiles of different heights (existing logic)
      if (neighbor && neighbor.semiFogged) {
        const fogTop1 = getSemiFogTop(tile, heightScale);
        const fogTop2 = getSemiFogTop(neighbor, heightScale);
        if (Math.abs(fogTop1 - fogTop2) < 0.01) return;

        // Only draw once per edge
        const key =
          q < nq || (q === nq && r < nr)
            ? `${q},${r}-${nq},${nr}`
            : `${nq},${nr}-${q},${r}`;
        if (seen.has(key)) return;
        seen.add(key);

        const minFogTop = Math.min(fogTop1, fogTop2);
        const maxFogTop = Math.max(fogTop1, fogTop2);
        const wallHeight = maxFogTop - minFogTop;
        const wallY = minFogTop + wallHeight / 2;
        const { mx, mz, angle } = getEdgeTransform(q, r, nq, nr, spacing);
        wallSegments.push({
          position: [mx, wallY, mz],
          rotation: [0, angle, 0],
          height: wallHeight,
        });
      }
    });
  });

  const thickness = spacing * 0.09;
  const width = spacing * 0.95;

  const matRef = useRef();
  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.time.value += delta * 0.25;
    }
  });

  return (
    <>
      {wallSegments.map((seg, i) => (
        <mesh
          key={`semifogwall-${i}`}
          position={seg.position}
          rotation={seg.rotation}
          renderOrder={semiFogStyles.renderOrder || 950}
        >
          <boxGeometry args={[width, seg.height, thickness]} />
          <semiFogHexShaderMaterial ref={matRef} transparent />
        </mesh>
      ))}
    </>
  );
}

export default React.memo(SemiFogWallLayer);
