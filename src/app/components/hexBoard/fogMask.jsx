import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { hexToPosition } from "./hexUtilities";

const ExtrudedFogMask = ({ board, spacing, wallHeight = 5 }) => {
  const ref = useRef();

  useEffect(() => {
    const tileRadius = spacing; // Use spacing as tile radius.
    let minX = Infinity,
      maxX = -Infinity,
      minZ = Infinity,
      maxZ = -Infinity;

    // Compute board boundaries expanded by the tile radius.
    board.tiles.forEach((tile) => {
      const [cx, , cz] = hexToPosition(tile.q, tile.r, spacing);
      const left = cx - tileRadius;
      const right = cx + tileRadius;
      if (left < minX) minX = left;
      if (right > maxX) maxX = right;
      const top = cz + tileRadius;
      const bottom = cz - tileRadius;
      if (bottom < minZ) minZ = bottom;
      if (top > maxZ) maxZ = top;
    });

    const extra = 100; // Extend the outer margin to push mask edges far away.
    const outerShape = new THREE.Shape();
    outerShape.moveTo(minX - extra, -(maxZ + extra));
    outerShape.lineTo(maxX + extra, -(maxZ + extra));
    outerShape.lineTo(maxX + extra, -(minZ - extra));
    outerShape.lineTo(minX - extra, -(minZ - extra));
    outerShape.lineTo(minX - extra, -(maxZ + extra));

    // Create a hole in the shape corresponding to the board extents.
    const hole = new THREE.Path();
    hole.moveTo(minX, -maxZ);
    hole.lineTo(maxX, -maxZ);
    hole.lineTo(maxX, -minZ);
    hole.lineTo(minX, -minZ);
    hole.lineTo(minX, -maxZ);
    outerShape.holes.push(hole);

    // Extrude the shape to create walls from y=0 to y=wallHeight.
    const extrudeSettings = {
      depth: wallHeight, // Wall height.
      steps: 1,
      bevelEnabled: false,
    };
    const geometry = new THREE.ExtrudeGeometry(outerShape, extrudeSettings);
    geometry.rotateX(-Math.PI / 2); // Rotate so that extrusion goes upward (+Y).

    // Align bottom with y=0.
    geometry.computeBoundingBox();
    const bb = geometry.boundingBox;
    if (bb.min.y < 0) geometry.translate(0, -bb.min.y, 0);

    // Update the mesh geometry.
    if (ref.current) {
      ref.current.geometry?.dispose();
      ref.current.geometry = geometry;
    }
  }, [board, spacing, wallHeight]);

  return (
    <mesh ref={ref} position={[0, 0, 0]} renderOrder={999}>
      <meshBasicMaterial
        color="#000000" // Black fog color.
        opacity={0.8} // Slight transparency.
        transparent
        depthWrite={false}
        side={THREE.DoubleSide} // Render both sides.
      />
    </mesh>
  );
};

export default ExtrudedFogMask;
