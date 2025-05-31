import * as THREE from "three";

// topYList: array of 6 y-values for the OUTER ring (relative to the tile's "topY" world position)
// innerRadius: radius of the flat central hex (0.5–0.7 recommended)
export default function hexPrismGeometry(
  radius = 1,
  height = 0.5,
  topYList = null,
  innerRadius = 0.5 // <--- new parameter
) {
  const positions = [];
  const indices = [];

  // Center top vertex
  positions.push(0, 0, 0); // 0: top center

  // Inner ring (flat hex, at y=0)
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    positions.push(
      Math.cos(angle) * innerRadius,
      0,
      Math.sin(angle) * innerRadius
    ); // 1..6
  }

  // Outer ring (can drop, y=topYList[i])
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const y = topYList ? topYList[i] : 0;
    positions.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius); // 7..12
  }

  // Bottom center
  positions.push(0, -height, 0); // 13

  // Bottom ring
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    positions.push(Math.cos(angle) * radius, -height, Math.sin(angle) * radius); // 14..19
  }

  // Top face (flat hex)
  for (let i = 0; i < 6; i++) {
    indices.push(
      0, // center
      1 + i,
      1 + ((i + 1) % 6)
    );
  }

  // Skirt (between inner and outer ring)
  for (let i = 0; i < 6; i++) {
    const innerA = 1 + i;
    const innerB = 1 + ((i + 1) % 6);
    const outerA = 7 + i;
    const outerB = 7 + ((i + 1) % 6);

    // Two triangles per skirt section
    indices.push(innerA, outerA, outerB);
    indices.push(innerA, outerB, innerB);
  }

  // Side faces (outer ring to bottom ring)
  for (let i = 0; i < 6; i++) {
    const outerA = 7 + i;
    const outerB = 7 + ((i + 1) % 6);
    const botA = 14 + i;
    const botB = 14 + ((i + 1) % 6);

    indices.push(outerA, botA, botB);
    indices.push(outerA, botB, outerB);
  }

  // Bottom face
  for (let i = 0; i < 6; i++) {
    indices.push(
      13, // bottom center
      14 + ((i + 1) % 6),
      14 + i
    );
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
