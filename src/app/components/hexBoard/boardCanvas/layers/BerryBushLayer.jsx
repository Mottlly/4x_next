import React, { useMemo, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";

// Berry offsets/colors for each bush
const berryDefs = [
  { pos: [0.09, 0.28, 0.04], scale: 1, color: "#b71c1c", radius: 0.045 },
  { pos: [-0.08, 0.23, -0.07], scale: 0.78, color: "#b71c1c", radius: 0.035 },
  { pos: [0.04, 0.22, -0.09], scale: 0.67, color: "#7b1fa2", radius: 0.03 },
  { pos: [-0.07, 0.29, 0.06], scale: 0.56, color: "#b71c1c", radius: 0.025 },
];

// Generate transforms for all bushes on a tile
function getBushTransforms(
  q,
  r,
  spacing,
  tileHeight,
  bushCount = 12,
  radiusFactor = 0.78
) {
  const [cx, , cz] = hexToPosition(q, r, spacing);
  const y = tileHeight;
  const bushes = [];
  for (let i = 0; i < bushCount; i++) {
    const angle = Math.PI / 6 + i * ((2 * Math.PI) / bushCount);
    const px = cx + Math.cos(angle) * spacing * radiusFactor;
    const pz = cz + Math.sin(angle) * spacing * radiusFactor;
    const rot = angle + Math.random() * 0.6;
    const scale = 0.38 + 0.12 * Math.sin(i * 1.7 + q + r);
    bushes.push({ pos: [px, y, pz], rot, scale });
  }
  return bushes;
}

function BerryBushLayer({ tiles, spacing, heightScale }) {
  // Compute transforms for bush bodies and berries (memoized)
  const { bodies, berries } = useMemo(() => {
    const bodies = [];
    const berries = berryDefs.map(() => []);
    tiles
      .filter((tile) => tile.type === "grassland" && tile.discovered)
      .forEach((tile) => {
        const y = tile.height * heightScale + 0.01;
        getBushTransforms(tile.q, tile.r, spacing, y).forEach(
          ({ pos, rot, scale }) => {
            // Bush body transform
            bodies.push({
              pos: [pos[0], pos[1] + 0.18 * scale, pos[2]],
              rot,
              scale,
            });
            // Each berry: position relative to bush, scaled
            berryDefs.forEach((def, idx) => {
              const berryPos = [
                pos[0] + def.pos[0] * scale,
                pos[1] + def.pos[1] * scale,
                pos[2] + def.pos[2] * scale,
              ];
              berries[idx].push({
                pos: berryPos,
                rot,
                scale: scale * def.scale,
              });
            });
          }
        );
      });
    return { bodies, berries };
  }, [tiles, spacing, heightScale]);

  // Refs for bush body and each berry type
  const bodyRef = useRef();
  const berryRefs = berryDefs.map(() => useRef());

  // Set transform matrices for each bush and berry instance
  useLayoutEffect(() => {
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

    berryDefs.forEach((def, idx) => {
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
    });
  }, [bodies, berries]);

  // Instanced meshes: one for bush bodies, one for each berry type
  return (
    <>
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
