import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei/helpers/shaderMaterial";

// Shared fog shader material for consistent fog effects across components
export const FogHexShaderMaterial = shaderMaterial(
  { time: 0.0 },
  // Vertex shader
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment shader
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

// Register the material for use in JSX
extend({ FogHexShaderMaterial });
