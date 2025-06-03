import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import { riverStyles } from "@/library/styles/stylesIndex";
import * as THREE from "three";

function RiverPathMesh({ path, spacing, heightScale, radius, color }) {
  const innerRadius = 0.5 * spacing; // match hexPrismGeometry innerRadius
  const outerRadius = 1.0 * spacing; // match hexPrismGeometry radius

  function getCenter(tile) {
    const [x, , z] = hexToPosition(tile.q, tile.r, spacing);
    const y = tile.height * heightScale + 0.01;
    return new THREE.Vector3(x, y, z);
  }

  function getDirection(tileA, tileB) {
    const [xA, , zA] = hexToPosition(tileA.q, tileA.r, spacing);
    const [xB, , zB] = hexToPosition(tileB.q, tileB.r, spacing);
    const dx = xB - xA;
    const dz = zB - zA;
    const len = Math.sqrt(dx * dx + dz * dz);
    return { dx: dx / len, dz: dz / len };
  }

  let points = [];
  if (path.length > 1) {
    points.push(getCenter(path[0]));
    for (let i = 0; i < path.length - 1; i++) {
      const tileA = path[i];
      const tileB = path[i + 1];
      const [xA, , zA] = hexToPosition(tileA.q, tileA.r, spacing);
      const [xB, , zB] = hexToPosition(tileB.q, tileB.r, spacing);
      const dir = getDirection(tileA, tileB);

      // Plateau edge (inner ring, at tileA's height)
      const plateauEdge = new THREE.Vector3(
        xA + dir.dx * innerRadius,
        tileA.height * heightScale + 0.01,
        zA + dir.dz * innerRadius
      );
      points.push(plateauEdge);

      // Skirt slope: interpolate from innerRadius to outerRadius, y from tileA to tileB
      const steps = 3;
      for (let s = 1; s <= steps; s++) {
        const t = s / (steps + 1);
        const r = innerRadius + t * (outerRadius - innerRadius);
        const y =
          (1 - t) * tileA.height * heightScale +
          t * tileB.height * heightScale +
          0.01;
        points.push(new THREE.Vector3(xA + dir.dx * r, y, zA + dir.dz * r));
      }

      // Outer ring (at tileB's height)
      const skirtEdge = new THREE.Vector3(
        xA + dir.dx * outerRadius,
        tileB.height * heightScale + 0.01,
        zA + dir.dz * outerRadius
      );
      points.push(skirtEdge);

      // Plateau edge of tileB (optional, for smoothness)
      const plateauEdgeB = new THREE.Vector3(
        xB - dir.dx * innerRadius,
        tileB.height * heightScale + 0.01,
        zB - dir.dz * innerRadius
      );
      points.push(plateauEdgeB);

      // Center of tileB
      points.push(getCenter(tileB));
    }
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(
    curve,
    Math.max(4, points.length * 4),
    radius,
    12,
    false
  );

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function RiverLayer({ riverPaths, spacing, heightScale, tiles }) {
  const radius = spacing * 0.07; // was 0.13, now thinner

  return (
    <>
      {riverPaths.map((path, i) =>
        path.length > 1 ? (
          <RiverPathMesh
            key={`river-path-${i}`}
            path={path}
            spacing={spacing}
            heightScale={heightScale}
            radius={radius}
            color={riverStyles.color}
            tiles={tiles} // <-- pass tiles here
          />
        ) : null
      )}
    </>
  );
}

export default React.memo(RiverLayer);
