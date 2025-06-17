import React, { useMemo, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";

// Each patch is a cluster of 4 blades, each instanced
function getBladeTransforms(q, r, spacing, tileHeight, patchCount = 30, radiusFactor = 0.78) {
  const [cx, , cz] = hexToPosition(q, r, spacing);
  const y = tileHeight;
  const transforms = [];
  for (let i = 0; i < patchCount; i++) {
    const patchAngle = Math.PI / 6 + i * ((2 * Math.PI) / patchCount);
    const px = cx + Math.cos(patchAngle) * spacing * radiusFactor;
    const pz = cz + Math.sin(patchAngle) * spacing * radiusFactor;
    const patchPos = [px, y, pz];
    const patchRot = patchAngle + Math.random() * 0.6;
    const patchScale = (0.5 + 0.18 * Math.sin(i * 1.7 + q + r)) * 1.1;

    // 4 blades per patch, slightly offset and rotated
    for (let b = 0; b < 4; b++) {
      const angle = (b / 4) * Math.PI * 2 + patchRot;
      const bx = Math.cos(angle) * 0.08 * patchScale;
      const bz = Math.sin(angle) * 0.08 * patchScale;
      const bladeRot = angle + (Math.random() - 0.5) * 0.3;
      const bladeTilt = (Math.random() - 0.5) * 0.3;
      transforms.push({
        pos: [patchPos[0] + bx, patchPos[1] + 0.18 * patchScale, patchPos[2] + bz],
        scale: patchScale,
        rot: [0, bladeRot, bladeTilt],
      });
    }
  }
  return transforms;
}

function GrassPatchLayer({ tiles, spacing, heightScale }) {
  const blades = useMemo(() => {
    return tiles
      .filter((tile) => tile.type === "plains" && tile.discovered)
      .flatMap((tile) =>
        getBladeTransforms(tile.q, tile.r, spacing, tile.height * heightScale + 0.01)
      );
  }, [tiles, spacing, heightScale]);

  const count = blades.length;
  const meshRef = useRef();

  useLayoutEffect(() => {
    blades.forEach(({ pos, scale, rot }, i) => {
      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(...pos),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)),
        new THREE.Vector3(scale, scale, scale)
      );
      meshRef.current.setMatrixAt(i, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [blades]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <cylinderGeometry args={[0.015, 0.025, 0.36, 6]} />
      <meshStandardMaterial color="#7ec850" />
    </instancedMesh>
  );
}

export default React.memo(GrassPatchLayer);
