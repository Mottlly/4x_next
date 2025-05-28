import * as THREE from "three";

// topYList: array of 6 y-values for the top ring (relative to the tile's "topY" world position)
export default function hexPrismGeometry(
  radius = 1,
  height = 0.5,
  topYList = null
) {
  const positions = [];
  const indices = [];

  // Center vertices
  positions.push(0, 0, 0); // 0: top center
  positions.push(0, -height, 0); // 1: bottom center

  // Top ring (2..7)
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const y = topYList ? topYList[i] : 0;
    positions.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
  }
  // Bottom ring (8..13)
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    positions.push(Math.cos(angle) * radius, -height, Math.sin(angle) * radius);
  }

  // Top face
  for (let i = 0; i < 6; i++) {
    indices.push(0, 2 + i, 2 + ((i + 1) % 6));
  }
  // Side faces
  for (let i = 0; i < 6; i++) {
    const topA = 2 + i;
    const topB = 2 + ((i + 1) % 6);
    const botA = 8 + i;
    const botB = 8 + ((i + 1) % 6);
    indices.push(topA, botA, botB);
    indices.push(topA, botB, topB);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
