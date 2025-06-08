import React, { useMemo } from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import { riverStyles } from "@/library/styles/stylesIndex";
import * as THREE from "three";

function RiverPathMesh({ path, spacing, heightScale, radius, color }) {
  const outerRadius = spacing * 0.95;

  function getOffset(q, r, scale = 0.28) {
    const seed = Math.sin(q * 374761393 + r * 668265263) * 43758.5453;
    const angle = seed % (2 * Math.PI);
    const mag = (Math.abs(Math.sin(seed)) + 0.2) * scale;
    return [Math.cos(angle) * mag, Math.sin(angle) * mag];
  }

  function getCenter(tile, noOffset = false) {
    const [x, , z] = hexToPosition(tile.q, tile.r, spacing);
    const y = tile.height * heightScale - 0.05;
    if (noOffset) return new THREE.Vector3(x, y, z);
    const [ox, oz] = getOffset(tile.q, tile.r, spacing * 0.45);
    return new THREE.Vector3(x + ox, y, z + oz);
  }

  function getEdge(tileA, tileB, y) {
    const [xA, , zA] = hexToPosition(tileA.q, tileA.r, spacing);
    const [xB, , zB] = hexToPosition(tileB.q, tileB.r, spacing);
    const dx = xB - xA;
    const dz = zB - zA;
    const len = Math.sqrt(dx * dx + dz * dz);
    const ex = xA + (dx / len) * outerRadius;
    const ez = zA + (dz / len) * outerRadius;
    return new THREE.Vector3(ex, y, ez);
  }

  function getPreEdge(tileA, tileB, y, t = 0.75) {
    const [xA, , zA] = hexToPosition(tileA.q, tileA.r, spacing);
    const [xB, , zB] = hexToPosition(tileB.q, tileB.r, spacing);
    const dx = xB - xA;
    const dz = zB - zA;
    const len = Math.sqrt(dx * dx + dz * dz);
    const ex = xA + (dx / len) * (outerRadius * t);
    const ez = zA + (dz / len) * (outerRadius * t);
    return new THREE.Vector3(ex, y, ez);
  }

  function getPostEdge(tileA, tileB, y, t = 0.88) {
    // t=0.88 means just after the edge, but not all the way to the center of the next tile
    const [xA, , zA] = hexToPosition(tileA.q, tileA.r, spacing);
    const [xB, , zB] = hexToPosition(tileB.q, tileB.r, spacing);
    const dx = xB - xA;
    const dz = zB - zA;
    const len = Math.sqrt(dx * dx + dz * dz);
    const ex = xA + (dx / len) * (outerRadius * t);
    const ez = zA + (dz / len) * (outerRadius * t);
    return new THREE.Vector3(ex, y, ez);
  }

  // Build the points array for the whole river path
  let points = [];
  if (path.length > 1) {
    points.push(getCenter(path[0], true));
    for (let i = 0; i < path.length - 1; i++) {
      const tileA = path[i];
      const tileB = path[i + 1];
      const yA = tileA.height * heightScale - 0.05;
      const yB = tileB.height * heightScale - 0.05;

      points.push(getPreEdge(tileA, tileB, yA, 0.6));
      const edgeA = getEdge(tileA, tileB, yA);
      const edgeB = getEdge(tileA, tileB, yB);

      points.push(edgeA);
      points.push(edgeB);
      // Add a post-edge point at the lower tile's height, just after the edge
      points.push(getPostEdge(tileA, tileB, yB, 0.88));
      points.push(getCenter(tileB));
    }
  }

  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.0);
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

function LakeMesh({
  tile,
  spacing,
  heightScale,
  baseRadius,
  thickness,
  color,
}) {
  const [x, , z] = hexToPosition(tile.q, tile.r, spacing);
  const y = tile.height * heightScale - 0.13 + thickness / 2;

  // Lower frequency, lower amplitude for rounder, more natural lake
  const segments = 48;
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      // Lower frequency and amplitude for rounder edges
      const wobbleSeed = Math.sin(tile.q * 7.13 + tile.r * 3.77 + i * 1.1);
      const wobble =
        (Math.sin(wobbleSeed * 3 + i * 0.7) +
          Math.cos(wobbleSeed * 2 - i * 0.9)) *
        0.09;
      const r = baseRadius * (0.97 + 0.13 * wobble);
      const px = Math.cos(angle) * r;
      const pz = Math.sin(angle) * r;
      if (i === 0) s.moveTo(px, pz);
      else s.lineTo(px, pz);
    }
    return s;
  }, [tile.q, tile.r, baseRadius]);

  const geometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(shape, {
        steps: 1,
        depth: thickness,
        bevelEnabled: false,
      }),
    [shape, thickness]
  );
  geometry.translate(0, -thickness / 2, 0); // center vertically

  return (
    <mesh position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color={color} opacity={1} />
    </mesh>
  );
}

function RiverLayer({ riverPaths, spacing, heightScale, tiles }) {
  const radius = spacing * 0.07;
  const lakeColor = "#3ec6ff";
  const lakeRadius = spacing * 0.3; // half the previous 0.6
  const lakeThickness = 0.12;

  return (
    <>
      {riverPaths.map((path, i) => {
        if (path.length < 1) return null;
        return (
          <React.Fragment key={`river-path-${i}`}>
            <LakeMesh
              tile={path[0]}
              spacing={spacing}
              heightScale={heightScale}
              baseRadius={lakeRadius}
              thickness={lakeThickness}
              color={lakeColor}
            />
            <RiverPathMesh
              path={path}
              spacing={spacing}
              heightScale={heightScale}
              radius={radius}
              color={riverStyles.color}
              tiles={tiles}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}

export default React.memo(RiverLayer);
