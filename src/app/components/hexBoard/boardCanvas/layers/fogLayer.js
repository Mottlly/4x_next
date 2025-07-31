import React, { useRef, useMemo, useLayoutEffect } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import { fogStyles } from "@/library/styles/stylesIndex";

// Define material with unique name for instanced fog layer
const InstancedFogShaderMaterial = shaderMaterial(
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
extend({ InstancedFogShaderMaterial });

function FogLayer({ tiles, spacing, heightScale, onTileClick }) {
  const instanceRef = useRef();
  const matRef = useRef();

  const fogThickness = fogStyles.geometry.args[2];
  const fogYOffset = 0.01;

  // Compute fog tile transforms (memoized)
  const fogTiles = useMemo(() => {
    const result = tiles.map((tile) => {
      const [x, , z] = hexToPosition(tile.q, tile.r, spacing);
      const y =
        tile.height * heightScale + 0.25 + fogThickness / 2 + fogYOffset;
      return {
        position: [x, y, z],
        tile: tile,
        radius: spacing,
      };
    });
    return result;
  }, [tiles, spacing, heightScale, fogThickness, fogYOffset]);

  // Create base geometry for instancing
  const baseGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(spacing, spacing, fogThickness, 6);
  }, [spacing, fogThickness]);

  // Update instance matrices
  useLayoutEffect(() => {
    if (!instanceRef.current || fogTiles.length === 0) return;

    fogTiles.forEach(({ position }, index) => {
      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(...position),
        new THREE.Quaternion(),
        new THREE.Vector3(1, 1, 1)
      );
      instanceRef.current.setMatrixAt(index, matrix);
    });

    instanceRef.current.instanceMatrix.needsUpdate = true;
    instanceRef.current.count = fogTiles.length;
  }, [fogTiles]);

  // Animate the shader time
  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.time.value += delta * 0.5;
    }
  });

  // Handle click events (note: instanced meshes have limited click support)
  const handleClick = (event) => {
    if (onTileClick && event.instanceId !== undefined) {
      const clickedTile = fogTiles[event.instanceId];
      if (clickedTile) {
        onTileClick(clickedTile.tile);
      }
    }
  };

  if (fogTiles.length === 0) {
    return null;
  }

  return (
    <instancedMesh
      ref={instanceRef}
      args={[baseGeometry, null, fogTiles.length]}
      onClick={handleClick}
      visible={true}
    >
      {/* Temporarily back to basic material for debugging */}
      <instancedFogShaderMaterial ref={matRef} />
    </instancedMesh>
  );
}

export default React.memo(FogLayer);
