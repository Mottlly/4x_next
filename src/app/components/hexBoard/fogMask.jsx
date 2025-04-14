import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { hexToPosition } from "./hexUtilities";

// Create a custom shader material with fractal noise (fbm) for animated fog.
// Increase the time multiplier and noise frequency for noticeable movement.
const FogShaderMaterial = shaderMaterial(
  {
    time: 0,
  },
  // Vertex Shader: Pass through position and UV coordinates.
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader: Uses fbm to generate animated noise.
  `
    uniform float time;
    varying vec2 vUv;

    // Hash function for pseudo-random numbers.
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    // 2D noise function.
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    // Fractal Brownian Motion to accumulate multiple noise layers.
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
      // Increase noise frequency (multiply UV) and add time to animate.
      vec2 uv = vUv * 10.0;
      uv.y += time * 0.5; // Increase vertical speed
      
      // Calculate fractal noise.
      float n = fbm(uv);
      
      // Blend between two fog colors; adjust colors if desired.
      vec3 fogColor = mix(vec3(0.9), vec3(0.6), n);
      
      gl_FragColor = vec4(fogColor, 0.7);
    }
  `
);

extend({ FogShaderMaterial });

const VolumetricFogMask = ({ board, spacing, wallHeight = 5 }) => {
  const meshRef = useRef();

  useEffect(() => {
    const tileRadius = spacing; // Approximate tile radius
    let minX = Infinity,
      maxX = -Infinity,
      minZ = Infinity,
      maxZ = -Infinity;

    // Compute board boundaries considering the full tile area.
    board.tiles.forEach((tile) => {
      const [cx, , cz] = hexToPosition(tile.q, tile.r, spacing);
      const left = cx - tileRadius;
      const right = cx + tileRadius;
      if (left < minX) minX = left;
      if (right > maxX) maxX = right;
      const top = cz + tileRadius;
      const bottom = cz - tileRadius;
      if (bottom < minZ) minZ = bottom;
      if (top > maxZ) maxZ = top;
    });

    const extra = 100; // Extend the outer margin to hide mask edges.
    const outerShape = new THREE.Shape();
    outerShape.moveTo(minX - extra, -(maxZ + extra));
    outerShape.lineTo(maxX + extra, -(maxZ + extra));
    outerShape.lineTo(maxX + extra, -(minZ - extra));
    outerShape.lineTo(minX - extra, -(minZ - extra));
    outerShape.lineTo(minX - extra, -(maxZ + extra));

    const hole = new THREE.Path();
    hole.moveTo(minX, -maxZ);
    hole.lineTo(maxX, -maxZ);
    hole.lineTo(maxX, -minZ);
    hole.lineTo(minX, -minZ);
    hole.lineTo(minX, -maxZ);
    outerShape.holes.push(hole);

    const extrudeSettings = {
      depth: wallHeight, // Extrude height for wall.
      steps: 1,
      bevelEnabled: false,
    };
    const geometry = new THREE.ExtrudeGeometry(outerShape, extrudeSettings);
    geometry.rotateX(-Math.PI / 2); // Rotate so extrusion is along +Y.
    geometry.computeBoundingBox();
    const bb = geometry.boundingBox;
    if (bb.min.y < 0) geometry.translate(0, -bb.min.y, 0);

    // Generate UVs if they don't exist.
    if (!geometry.attributes.uv) {
      geometry.computeBoundingBox();
      const max = geometry.boundingBox.max;
      const min = geometry.boundingBox.min;
      const offset = new THREE.Vector2(-min.x, -min.y);
      const range = new THREE.Vector2(max.x - min.x, max.y - min.y);
      const uvArray = [];
      const pos = geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        uvArray.push((pos.getX(i) + offset.x) / range.x);
        uvArray.push((pos.getY(i) + offset.y) / range.y);
      }
      geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvArray, 2));
    }

    if (meshRef.current) {
      meshRef.current.geometry?.dispose();
      meshRef.current.geometry = geometry;
    }
  }, [board, spacing, wallHeight]);

  // Update the shader's time uniform to animate the fog.
  useFrame((state, delta) => {
    if (meshRef.current && meshRef.current.material.uniforms) {
      meshRef.current.material.uniforms.time.value += delta;
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={999}>
      <fogShaderMaterial attach="material" />
    </mesh>
  );
};

export default VolumetricFogMask;
