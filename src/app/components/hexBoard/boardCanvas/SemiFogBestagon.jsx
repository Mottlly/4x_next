"use client";

import React, { useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial, Edges } from "@react-three/drei";

// Custom shader for semi-fog
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
    for(int i = 0; i < 4; i++) {
      total += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return total;
  }
  void main() {
    vec2 uv2 = vUv * 4.0;
    uv2 += time * 0.12;
    float f = fbm(uv2);

    // Radial gradient for softer edges
    float dist = distance(vUv, vec2(0.5, 0.5));
    float edgeFade = smoothstep(0.45, 0.5, dist);

    // Neutral gray fog colors
    vec3 col = mix(vec3(0.18,0.18,0.18), vec3(0.32,0.32,0.32), f);

    // Blend with edge fade for softer look
    float alpha = mix(0.33, 0.12, edgeFade);

    gl_FragColor = vec4(col, alpha);
  }
  `
);
extend({ SemiFogHexShaderMaterial });

export default function SemiFogBestagon({
  position,
  radius = 1,
  thickness = 0.05,
  speed = 0.25,
}) {
  const matRef = useRef();

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.time.value += delta * speed;
    }
  });

  return (
    <mesh position={position} renderOrder={1000}>
      <cylinderGeometry args={[radius, radius, thickness, 6]} />
      <semiFogHexShaderMaterial ref={matRef} transparent />
      <Edges color="#bcd" />
    </mesh>
  );
}
