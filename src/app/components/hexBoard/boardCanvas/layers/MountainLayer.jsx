import React, { useMemo, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";

// Definitions for side peaks and snow cap (relative offsets, scale, color)
const sidePeaks = [
  {
    pos: [-0.13, 0.18, 0.09],
    scale: 0.5,
    color: "#757575",
    radius: 0.11,
    height: 0.32,
  },
  {
    pos: [0.14, 0.13, -0.08],
    scale: 0.41,
    color: "#a0a0a0",
    radius: 0.09,
    height: 0.22,
  },
];
const snowCap = {
  pos: [0, 0.62, 0],
  scale: 0.41,
  color: "#f5f5f5",
  radius: 0.09,
  height: 0.13,
};

// Generate transforms for all mountain peaks on a tile
function getMountainTransforms(
  q,
  r,
  spacing,
  tileHeight,
  count = 8,
  radiusFactor = 0.7
) {
  const [cx, , cz] = hexToPosition(q, r, spacing); // Tile center
  const y = tileHeight;
  const mountains = [];
  
  // Create a seeded random generator based on tile coordinates for consistency
  const seed = q * 1000 + r + 84; // Different seed offset than other terrain
  const random = (offset = 0) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };
  
  for (let i = 0; i < count; i++) {
    // Base angle with some randomness
    const baseAngle = Math.PI / 6 + i * ((2 * Math.PI) / count);
    const angleVariation = (random(i * 5.9) - 0.5) * 0.7; // ±0.35 radians variation
    const angle = baseAngle + angleVariation;
    
    // Variable radius with randomness - creates more organic mountain ranges
    const minRadius = spacing * 0.45; // Minimum distance from center
    const maxRadius = spacing * radiusFactor;
    const radiusVariation = random(i * 3.3) * 0.35 + 0.8; // 0.8 to 1.15 multiplier
    const radius = (minRadius + (maxRadius - minRadius) * random(i * 2.5)) * radiusVariation;
    
    // Occasionally skip some positions for gaps (natural mountain formation)
    if (random(i * 6.1) < 0.1) continue; // 10% chance to skip
    
    const px = cx + Math.cos(angle) * radius;
    const pz = cz + Math.sin(angle) * radius;
    
    const rot = angle + random(i * 4.7) * 0.6;
    const scale = 0.45 + 0.28 * (random(i * 1.7 + q + r) * 0.5 + Math.sin(i * 1.7 + q + r) * 0.5);
    
    mountains.push({ pos: [px, y, pz], rot, scale });
  }
  return mountains;
}

function MountainLayer({ tiles, spacing, heightScale }) {
  // Compute transforms for main peaks, side peaks, and snow caps (memoized)
  const { mainPeaks, side1, side2, snowCaps } = useMemo(() => {
    const mainPeaks = [];
    const side1 = [];
    const side2 = [];
    const snowCaps = [];
    tiles
      .filter((tile) => tile.type === "mountain" && tile.discovered)
      .forEach((tile) => {
        const y = tile.height * heightScale + 0.01;
        getMountainTransforms(tile.q, tile.r, spacing, y).forEach(
          ({ pos, rot, scale }) => {
            // Main peak transform
            mainPeaks.push({
              pos: [pos[0], pos[1] + 0.32 * scale, pos[2]],
              rot,
              scale,
            });
            // Side peaks transforms (relative to main peak)
            sidePeaks.forEach((def, idx) => {
              const sidePos = [
                pos[0] + def.pos[0] * scale,
                pos[1] + def.pos[1] * scale,
                pos[2] + def.pos[2] * scale,
              ];
              (idx === 0 ? side1 : side2).push({
                pos: sidePos,
                rot,
                scale: scale * def.scale,
              });
            });
            // Snow cap transform (relative to main peak)
            snowCaps.push({
              pos: [
                pos[0] + snowCap.pos[0] * scale,
                pos[1] + snowCap.pos[1] * scale,
                pos[2] + snowCap.pos[2] * scale,
              ],
              rot,
              scale: scale * snowCap.scale,
            });
          }
        );
      });
    return { mainPeaks, side1, side2, snowCaps };
  }, [tiles, spacing, heightScale]);

  // Refs for each instanced mesh (main, side1, side2, snow)
  const mainRef = useRef();
  const side1Ref = useRef();
  const side2Ref = useRef();
  const snowRef = useRef();

  // Set transform matrices for each mountain part instance
  useLayoutEffect(() => {
    mainPeaks.forEach(({ pos, rot, scale }, i) => {
      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(...pos),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rot, 0)),
        new THREE.Vector3(scale, scale, scale)
      );
      mainRef.current.setMatrixAt(i, matrix);
    });
    mainRef.current.instanceMatrix.needsUpdate = true;

    side1.forEach(({ pos, rot, scale }, i) => {
      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(...pos),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rot, 0)),
        new THREE.Vector3(scale, scale, scale)
      );
      side1Ref.current.setMatrixAt(i, matrix);
    });
    side1Ref.current.instanceMatrix.needsUpdate = true;

    side2.forEach(({ pos, rot, scale }, i) => {
      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(...pos),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rot, 0)),
        new THREE.Vector3(scale, scale, scale)
      );
      side2Ref.current.setMatrixAt(i, matrix);
    });
    side2Ref.current.instanceMatrix.needsUpdate = true;

    snowCaps.forEach(({ pos, rot, scale }, i) => {
      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(...pos),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rot, 0)),
        new THREE.Vector3(scale, scale, scale)
      );
      snowRef.current.setMatrixAt(i, matrix);
    });
    snowRef.current.instanceMatrix.needsUpdate = true;
  }, [mainPeaks, side1, side2, snowCaps]);

  // Each instancedMesh draws all instances of that part (main, side, snow)
  return (
    <>
      {/* Main peak */}
      <instancedMesh ref={mainRef} args={[null, null, mainPeaks.length]}>
        <coneGeometry args={[0.22, 0.65, 7]} />
        <meshStandardMaterial color="#888888" />
      </instancedMesh>
      {/* Side peak 1 */}
      <instancedMesh ref={side1Ref} args={[null, null, side1.length]}>
        <coneGeometry args={[0.11, 0.32, 7]} />
        <meshStandardMaterial color="#757575" />
      </instancedMesh>
      {/* Side peak 2 */}
      <instancedMesh ref={side2Ref} args={[null, null, side2.length]}>
        <coneGeometry args={[0.09, 0.22, 7]} />
        <meshStandardMaterial color="#a0a0a0" />
      </instancedMesh>
      {/* Snow cap */}
      <instancedMesh ref={snowRef} args={[null, null, snowCaps.length]}>
        <coneGeometry args={[0.09, 0.13, 7]} />
        <meshStandardMaterial color="#f5f5f5" />
      </instancedMesh>
    </>
  );
}

export default React.memo(MountainLayer);
