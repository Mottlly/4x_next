// FogBestagon.jsx
"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial, Edges } from "@react-three/drei";

// 1) define a custom material with `time` uniform
const FogHexShaderMaterial = shaderMaterial(
  { time: 0.0 },
  // vertex shader: pass along UV
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // fragment shader: simple 2D fbm-based noise
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
    // scale UV so the noise “tiles” nicely
    vec2 uv2 = vUv * 4.0;
    // animate over time
    uv2 += time * 0.3;
    float f = fbm(uv2);
    // blend between two fog‐y greys
    vec3 col = mix(vec3(0.15), vec3(0.35), f);
    gl_FragColor = vec4(col, 1.0);
  }
  `
);
extend({ FogHexShaderMaterial });

export default function FogBestagon({
  position,
  userData,
  onClick: onExternalClick,
  radius = 1,
  thickness = 0.3,
  speed = 1.0, // controls how fast the fog noise animates
}) {
  const matRef = useRef();
  const meshRef = useRef();

  // forward-click to your handler
  const handleClick = (e) => {
    e.stopPropagation();
    if (onExternalClick) onExternalClick(userData.tile);
  };

  // drive the `time` uniform
  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.time.value += delta * speed;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
    >
      <cylinderGeometry args={[radius, radius, thickness, 6]} />
      <fogHexShaderMaterial ref={matRef} />
      <Edges color="white" />
    </mesh>
  );
}
