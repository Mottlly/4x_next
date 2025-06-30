import React, { useMemo, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";

// Berry offsets/colors for each bush
const berryDefs = [
  { pos: [0.12, 0.32, 0.06], scale: 1, color: "#ff1744", radius: 0.05 },
  { pos: [-0.1, 0.26, -0.09], scale: 0.85, color: "#ff1744", radius: 0.04 },
  { pos: [0.06, 0.25, -0.12], scale: 0.75, color: "#e91e63", radius: 0.035 },
  { pos: [-0.09, 0.33, 0.08], scale: 0.65, color: "#ff1744", radius: 0.03 },
];

// Generate transforms for all bushes on a tile
function getBushTransforms(
  q,
  r,
  spacing,
  tileHeight,
  bushCount = 10,
  radiusFactor = 0.78
) {
  const [cx, , cz] = hexToPosition(q, r, spacing);
  const y = tileHeight;
  const bushes = [];

  // Create a seeded random generator based on tile coordinates for consistency
  const seed = q * 1000 + r;
  const random = (offset = 0) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < bushCount; i++) {
    // Base angle with some randomness
    const baseAngle = Math.PI / 6 + i * ((2 * Math.PI) / bushCount);
    const angleVariation = (random(i * 7.3) - 0.5) * 0.8; // ±0.4 radians variation
    const angle = baseAngle + angleVariation;

    // Variable radius with randomness - creates more organic clusters
    const minRadius = spacing * 0.5; // Minimum distance from center
    const maxRadius = spacing * radiusFactor;
    const radiusVariation = random(i * 3.7) * 0.4 + 0.8; // 0.8 to 1.2 multiplier
    const radius =
      (minRadius + (maxRadius - minRadius) * random(i * 2.1)) * radiusVariation;

    // Occasionally skip some positions for gaps (more natural)
    if (random(i * 5.9) < 0.15) continue; // 15% chance to skip

    const px = cx + Math.cos(angle) * radius;
    const pz = cz + Math.sin(angle) * radius;

    // Random rotation and scale
    const rot = angle + random(i * 4.2) * 0.6;
    const scale =
      0.32 +
      0.16 * (random(i * 1.7 + q + r) * 0.5 + Math.sin(i * 1.7 + q + r) * 0.5);

    bushes.push({ pos: [px, y, pz], rot, scale });
  }
  return bushes;
}

// Generate transforms for small grass patches on a tile
function getSmallGrassTransforms(
  q,
  r,
  spacing,
  tileHeight,
  patchCount = 20,
  radiusFactor = 0.78
) {
  const [cx, , cz] = hexToPosition(q, r, spacing);
  const y = tileHeight;
  const transforms = [];

  // Create a seeded random generator based on tile coordinates for consistency
  const seed = q * 1000 + r + 256; // Different seed offset for small grass
  const random = (offset = 0) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < patchCount; i++) {
    // Base angle with some randomness
    const basePatchAngle = Math.PI / 6 + i * ((2 * Math.PI) / patchCount);
    const angleVariation = (random(i * 4.8) - 0.5) * 0.9;
    const patchAngle = basePatchAngle + angleVariation;

    // Variable radius with randomness - keep center clear for bushes
    const minRadius = spacing * 0.4; // Start further from center
    const maxRadius = spacing * radiusFactor;
    const radiusVariation = random(i * 3.1) * 0.4 + 0.8;
    const radius =
      (minRadius + (maxRadius - minRadius) * random(i * 2.3)) * radiusVariation;

    // Skip some positions for natural gaps
    if (random(i * 9.2) < 0.12) continue; // 12% chance to skip

    const px = cx + Math.cos(patchAngle) * radius;
    const pz = cz + Math.sin(patchAngle) * radius;
    const patchPos = [px, y, pz];
    const patchRot = patchAngle + random(i * 4.1) * 0.6;

    // 30% smaller scale than tall grass
    const patchScale =
      (0.4 +
        0.28 *
          (random(i * 2.1 + q + r) * 0.5 + Math.sin(i * 2.1 + q + r) * 0.5)) *
      0.7; // 30% smaller

    // Each patch: 3 blades instead of 4 for variety
    for (let b = 0; b < 3; b++) {
      const angle = (b / 3) * Math.PI * 2 + patchRot;
      const bx = Math.cos(angle) * 0.06 * patchScale; // Slightly tighter cluster
      const bz = Math.sin(angle) * 0.06 * patchScale;
      const bladeRot = angle + (random(i * b + 6.7) - 0.5) * 0.3;
      const bladeTilt = (random(i * b + 8.9) - 0.5) * 0.3;
      transforms.push({
        pos: [
          patchPos[0] + bx,
          patchPos[1] + 0.15 * patchScale, // Slightly lower
          patchPos[2] + bz,
        ],
        scale: patchScale,
        rot: [0, bladeRot, bladeTilt],
      });
    }
  }
  return transforms;
}

function BerryBushLayer({ tiles, spacing, heightScale }) {
  // Compute transforms for bush bodies, berries, and small grass (memoized)
  const { bodies, berries, smallGrass } = useMemo(() => {
    const bodies = [];
    const berries = berryDefs.map(() => []);
    const smallGrass = [];

    tiles
      .filter((tile) => tile.type === "grassland" && tile.discovered)
      .forEach((tile) => {
        const y = tile.height * heightScale + 0.01;

        // Generate bushes and berries
        getBushTransforms(tile.q, tile.r, spacing, y).forEach(
          ({ pos, rot, scale }) => {
            // Bush body transform
            bodies.push({
              pos: [pos[0], pos[1] + 0.18 * scale, pos[2]],
              rot,
              scale,
            }); // Each berry: position relative to bush, scaled and with more separation
            berryDefs.forEach((def, idx) => {
              const berryPos = [
                pos[0] + def.pos[0] * scale * 1.2, // Increased multiplier for better separation
                pos[1] + def.pos[1] * scale,
                pos[2] + def.pos[2] * scale * 1.2, // Increased multiplier for better separation
              ];
              berries[idx].push({
                pos: berryPos,
                rot,
                scale: scale * def.scale,
              });
            });
          }
        );

        // Generate small grass patches
        getSmallGrassTransforms(tile.q, tile.r, spacing, y).forEach(
          ({ pos, scale, rot }) => {
            smallGrass.push({ pos, scale, rot });
          }
        );
      });
    return { bodies, berries, smallGrass };
  }, [tiles, spacing, heightScale]);
  // Refs for bush body, each berry type, and small grass
  const bodyRef = useRef();
  const berryRefs = berryDefs.map(() => useRef());
  const smallGrassRef = useRef();
  // Set transform matrices for each bush and berry instance
  useLayoutEffect(() => {
    // Set bush body transforms
    if (bodyRef.current && bodies.length > 0) {
      bodies.forEach(({ pos, rot, scale }, i) => {
        const matrix = new THREE.Matrix4();
        matrix.compose(
          new THREE.Vector3(...pos),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rot, 0)),
          new THREE.Vector3(scale, scale, scale)
        );
        bodyRef.current.setMatrixAt(i, matrix);
      });
      bodyRef.current.instanceMatrix.needsUpdate = true;
    } // Set berry transforms for each berry type
    berryDefs.forEach((def, idx) => {
      if (berryRefs[idx].current && berries[idx].length > 0) {
        berries[idx].forEach(({ pos, rot, scale }, i) => {
          const matrix = new THREE.Matrix4();
          matrix.compose(
            new THREE.Vector3(...pos),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rot, 0)),
            new THREE.Vector3(scale, scale, scale)
          );
          berryRefs[idx].current.setMatrixAt(i, matrix);
        });
        berryRefs[idx].current.instanceMatrix.needsUpdate = true;
      }
    });

    // Set small grass transforms
    if (smallGrassRef.current && smallGrass.length > 0) {
      smallGrass.forEach(({ pos, scale, rot }, i) => {
        const matrix = new THREE.Matrix4();
        matrix.compose(
          new THREE.Vector3(...pos),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)),
          new THREE.Vector3(scale, scale, scale)
        );
        smallGrassRef.current.setMatrixAt(i, matrix);
      });
      smallGrassRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [bodies, berries, smallGrass]);
  // Instanced meshes: one for bush bodies, one for each berry type, and one for small grass
  return (
    <>
      {/* Small grass patches */}
      <instancedMesh ref={smallGrassRef} args={[null, null, smallGrass.length]}>
        <cylinderGeometry args={[0.012, 0.02, 0.28, 6]} />
        <meshStandardMaterial color="#5a8f3a" />
      </instancedMesh>
      {/* Bush body */}
      <instancedMesh ref={bodyRef} args={[null, null, bodies.length]}>
        <sphereGeometry args={[0.18, 12, 8]} />
        <meshStandardMaterial color="#3b7a2a" />
      </instancedMesh>
      {/* Berries */}
      {berryDefs.map((def, idx) => (
        <instancedMesh
          key={idx}
          ref={berryRefs[idx]}
          args={[null, null, berries[idx].length]}
        >
          <sphereGeometry args={[def.radius, 8, 6]} />
          <meshStandardMaterial color={def.color} />
        </instancedMesh>
      ))}
    </>
  );
}

export default React.memo(BerryBushLayer);
