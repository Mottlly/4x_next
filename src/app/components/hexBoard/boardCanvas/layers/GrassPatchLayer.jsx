import React, { useMemo, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";

// Generate transforms for all grass blades on a tile
function getBladeTransforms(
  q,
  r,
  spacing,
  tileHeight,
  patchCount = 30,
  radiusFactor = 0.78
) {
  const [cx, , cz] = hexToPosition(q, r, spacing); // Center of tile
  const y = tileHeight;
  const transforms = [];
  for (let i = 0; i < patchCount; i++) {
    // Place each patch in a ring
    const patchAngle = Math.PI / 6 + i * ((2 * Math.PI) / patchCount);
    const px = cx + Math.cos(patchAngle) * spacing * radiusFactor;
    const pz = cz + Math.sin(patchAngle) * spacing * radiusFactor;
    const patchPos = [px, y, pz];
    const patchRot = patchAngle + Math.random() * 0.6;
    const patchScale = (0.5 + 0.18 * Math.sin(i * 1.7 + q + r)) * 1.1;

    // Each patch: 4 blades, slightly offset/rotated
    for (let b = 0; b < 4; b++) {
      const angle = (b / 4) * Math.PI * 2 + patchRot;
      const bx = Math.cos(angle) * 0.08 * patchScale;
      const bz = Math.sin(angle) * 0.08 * patchScale;
      const bladeRot = angle + (Math.random() - 0.5) * 0.3;
      const bladeTilt = (Math.random() - 0.5) * 0.3;
      transforms.push({
        pos: [
          patchPos[0] + bx,
          patchPos[1] + 0.18 * patchScale,
          patchPos[2] + bz,
        ],
        scale: patchScale,
        rot: [0, bladeRot, bladeTilt],
      });
    }
  }
  return transforms;
}

function GrassPatchLayer({ tiles, spacing, heightScale }) {
  // Compute all blade transforms for visible tiles (memoized)
  const blades = useMemo(() => {
    return tiles
      .filter((tile) => tile.type === "plains" && tile.discovered)
      .flatMap((tile) =>
        getBladeTransforms(
          tile.q,
          tile.r,
          spacing,
          tile.height * heightScale + 0.01
        )
      );
  }, [tiles, spacing, heightScale]);

  const count = blades.length;
  const meshRef = useRef();

  // Set the transform matrix for each blade instance
  useLayoutEffect(() => {
    blades.forEach(({ pos, scale, rot }, i) => {
      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(...pos),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)),
        new THREE.Vector3(scale, scale, scale)
      );
      meshRef.current.setMatrixAt(i, matrix); // Assign transform to instance
    });
    meshRef.current.instanceMatrix.needsUpdate = true; // Notify Three.js to update
  }, [blades]);

  // Instanced mesh: all blades share geometry/material, only transform differs
  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <cylinderGeometry args={[0.015, 0.025, 0.36, 6]} />
      <meshStandardMaterial color="#7ec850" />
    </instancedMesh>
  );
}

export default React.memo(GrassPatchLayer);
