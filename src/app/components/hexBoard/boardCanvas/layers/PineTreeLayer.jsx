import React, { useMemo, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";

// Get positions for trees in a ring around the tile
function getOuterRingPositions(
  q,
  r,
  spacing,
  tileHeight,
  count = 12,
  radiusFactor = 0.78
) {
  const [cx, , cz] = hexToPosition(q, r, spacing);
  const y = tileHeight;
  const positions = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.PI / 6 + i * ((2 * Math.PI) / count);
    const px = cx + Math.cos(angle) * spacing * radiusFactor;
    const pz = cz + Math.sin(angle) * spacing * radiusFactor;
    positions.push({ pos: [px, y, pz], rot: angle });
  }
  return positions;
}

function PineTreeLayer({ tiles, spacing, heightScale }) {
  // Compute transforms for all pine trees (memoized)
  const pineTrees = useMemo(() => {
    return tiles
      .filter((tile) => tile.type === "forest" && tile.discovered)
      .flatMap((tile) => {
        const y = tile.height * heightScale + 0.01;
        const positions = getOuterRingPositions(
          tile.q,
          tile.r,
          spacing,
          y,
          12,
          0.78
        );
        return positions.map(({ pos, rot }, i) => ({
          pos,
          scale: 0.32 + 0.12 * Math.sin(i * 2.1 + tile.q + tile.r),
          rot,
        }));
      });
  }, [tiles, spacing, heightScale]);

  // Refs for each instanced mesh part
  const trunkRef = useRef();
  const foliage1Ref = useRef();
  const foliage2Ref = useRef();
  const foliage3Ref = useRef();

  // Set transform matrices for each tree part instance
  useLayoutEffect(() => {
    pineTrees.forEach(({ pos, scale, rot }, i) => {
      // Trunk
      {
        const matrix = new THREE.Matrix4();
        const trunkPos = [pos[0], pos[1] + 0.25 * scale, pos[2]];
        matrix.compose(
          new THREE.Vector3(...trunkPos),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rot, 0)),
          new THREE.Vector3(scale, scale, scale)
        );
        trunkRef.current.setMatrixAt(i, matrix);
      }
      // Lower foliage
      {
        const matrix = new THREE.Matrix4();
        const foliage1Pos = [pos[0], pos[1] + 0.6 * scale, pos[2]];
        matrix.compose(
          new THREE.Vector3(...foliage1Pos),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rot, 0)),
          new THREE.Vector3(scale, scale, scale)
        );
        foliage1Ref.current.setMatrixAt(i, matrix);
      }
      // Middle foliage
      {
        const matrix = new THREE.Matrix4();
        const foliage2Pos = [pos[0], pos[1] + 0.9 * scale, pos[2]];
        matrix.compose(
          new THREE.Vector3(...foliage2Pos),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rot, 0)),
          new THREE.Vector3(scale, scale, scale)
        );
        foliage2Ref.current.setMatrixAt(i, matrix);
      }
      // Top foliage
      {
        const matrix = new THREE.Matrix4();
        const foliage3Pos = [pos[0], pos[1] + 1.15 * scale, pos[2]];
        matrix.compose(
          new THREE.Vector3(...foliage3Pos),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rot, 0)),
          new THREE.Vector3(scale, scale, scale)
        );
        foliage3Ref.current.setMatrixAt(i, matrix);
      }
    });
    // Mark all instance matrices as needing update
    trunkRef.current.instanceMatrix.needsUpdate = true;
    foliage1Ref.current.instanceMatrix.needsUpdate = true;
    foliage2Ref.current.instanceMatrix.needsUpdate = true;
    foliage3Ref.current.instanceMatrix.needsUpdate = true;
  }, [pineTrees]);

  const count = pineTrees.length;

  // Each instancedMesh draws all trees for that part (trunk/foliage)
  return (
    <>
      {/* Trunk */}
      <instancedMesh ref={trunkRef} args={[null, null, count]}>
        <cylinderGeometry args={[0.07, 0.1, 0.5, 8]} />
        <meshStandardMaterial color="#8B5A2B" />
      </instancedMesh>
      {/* Lower foliage */}
      <instancedMesh ref={foliage1Ref} args={[null, null, count]}>
        <coneGeometry args={[0.35, 0.5, 8]} />
        <meshStandardMaterial color="#2e5d34" />
      </instancedMesh>
      {/* Middle foliage */}
      <instancedMesh ref={foliage2Ref} args={[null, null, count]}>
        <coneGeometry args={[0.28, 0.4, 8]} />
        <meshStandardMaterial color="#357a38" />
      </instancedMesh>
      {/* Top foliage */}
      <instancedMesh ref={foliage3Ref} args={[null, null, count]}>
        <coneGeometry args={[0.18, 0.32, 8]} />
        <meshStandardMaterial color="#4caf50" />
      </instancedMesh>
    </>
  );
}

export default React.memo(PineTreeLayer);
