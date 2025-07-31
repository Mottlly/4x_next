import React, { useRef, useMemo, useLayoutEffect } from "react";
import * as THREE from "three";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import getNeighborsAxial from "../../../../../library/utililies/game/tileUtilities/Positioning/getNeighbors";
import { fogStyles } from "@/library/styles/stylesIndex";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei/helpers/shaderMaterial";

// Define material with unique name for instanced fog wall layer
const InstancedFogWallShaderMaterial = shaderMaterial(
  { time: 0.0 },
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 transformed = position;
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;
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
extend({ InstancedFogWallShaderMaterial });

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
  const instanceRef = useRef();
  const matRef = useRef();

  // Compute wall segments (memoized)
  const wallSegments = useMemo(() => {
    const fogTiles = tiles; // tiles are already filtered in boardCanvas
    const segments = [];

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
        segments.push({
          position: [mx, wallY, mz],
          rotation: [0, angle, 0],
          height: wallHeight,
        });
      });
    });

    return segments;
  }, [tiles, spacing, heightScale]);

  // Wall dimensions
  const thickness = spacing * 0.09;
  const width = spacing * 0.95;

  // Create base geometry for instancing
  const baseGeometry = useMemo(() => {
    return new THREE.BoxGeometry(width, 1, thickness); // Height will be scaled per instance
  }, [width, thickness]);

  // Update instance matrices
  useLayoutEffect(() => {
    if (!instanceRef.current || wallSegments.length === 0) return;

    wallSegments.forEach((seg, index) => {
      const matrix = new THREE.Matrix4();
      const position = new THREE.Vector3(...seg.position);
      const rotation = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(...seg.rotation)
      );
      const scale = new THREE.Vector3(1, seg.height, 1); // Scale height individually

      matrix.compose(position, rotation, scale);
      instanceRef.current.setMatrixAt(index, matrix);
    });

    instanceRef.current.instanceMatrix.needsUpdate = true;
    instanceRef.current.count = wallSegments.length;
  }, [wallSegments]);

  // Animate the shader time
  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.time.value += delta * 0.5;
    }
  });

  if (wallSegments.length === 0) {
    return null;
  }

  return (
    <instancedMesh
      ref={instanceRef}
      args={[baseGeometry, null, wallSegments.length]}
      renderOrder={fogStyles.renderOrder || 900}
      visible={true}
    >
      <instancedFogWallShaderMaterial ref={matRef} transparent />
    </instancedMesh>
  );
}

export default React.memo(FogWallLayer);
