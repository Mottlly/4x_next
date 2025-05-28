import * as THREE from "three";

// getNeighborTopY: (sideIndex: 0-5) => number (world Y of neighbor's top)
export default function hexPrismGeometry(radius = 1, height = 0.5) {
  const positions = [];
  const indices = [];

  // Top at y=0, bottom at y=-height
  const yTop = 0;
  const yBot = -height;

  // Center vertices
  positions.push(0, yTop, 0); // 0: top center
  positions.push(0, yBot, 0); // 1: bottom center

  // Top ring (2..7)
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 3 * i;
    positions.push(Math.cos(angle) * radius, yTop, Math.sin(angle) * radius);
  }
  // Bottom ring (8..13)
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 3 * i;
    positions.push(Math.cos(angle) * radius, yBot, Math.sin(angle) * radius);
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
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}