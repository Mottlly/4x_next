import React, { useMemo, useRef, useLayoutEffect } from "react";
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

// Instanced Lake Component
function InstancedLakes({
  riverPaths,
  spacing,
  heightScale,
  lakeRadius,
  lakeThickness,
  lakeColor,
}) {
  const instanceRef = useRef();

  // Extract all starting tiles (lakes) from river paths
  const lakeTiles = useMemo(() => {
    return riverPaths.filter((path) => path.length > 0).map((path) => path[0]); // First tile of each path is a lake
  }, [riverPaths]);

  // Create base geometry for all lakes
  const baseGeometry = useMemo(() => {
    const segments = 48;
    const shape = new THREE.Shape();

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      // Simple circular shape for base - wobble will be handled by individual scaling
      const px = Math.cos(angle) * lakeRadius;
      const pz = Math.sin(angle) * lakeRadius;
      if (i === 0) shape.moveTo(px, pz);
      else shape.lineTo(px, pz);
    }

    const geometry = new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: lakeThickness,
      bevelEnabled: false,
    });
    geometry.translate(0, -lakeThickness / 2, 0); // center vertically
    return geometry;
  }, [lakeRadius, lakeThickness]);

  // Update instance matrices
  useLayoutEffect(() => {
    if (!instanceRef.current || lakeTiles.length === 0) return;

    lakeTiles.forEach((tile, index) => {
      const [x, , z] = hexToPosition(tile.q, tile.r, spacing);
      const y = tile.height * heightScale - 0.13 + lakeThickness / 2;

      // Create slight variation per lake using tile coordinates
      const wobbleSeed = Math.sin(tile.q * 7.13 + tile.r * 3.77);
      const scaleVariation = 0.97 + 0.06 * wobbleSeed; // ±3% variation

      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(x, y, z),
        new THREE.Quaternion().setFromEuler(
          new THREE.Euler(-Math.PI / 2, 0, 0)
        ),
        new THREE.Vector3(scaleVariation, scaleVariation, 1)
      );
      instanceRef.current.setMatrixAt(index, matrix);
    });

    instanceRef.current.instanceMatrix.needsUpdate = true;
    instanceRef.current.count = lakeTiles.length;
  }, [lakeTiles, spacing, heightScale, lakeThickness]);

  if (lakeTiles.length === 0) return null;

  return (
    <instancedMesh
      ref={instanceRef}
      args={[baseGeometry, null, lakeTiles.length]}
    >
      <meshStandardMaterial color={lakeColor} opacity={1} />
    </instancedMesh>
  );
}

function RiverLayer({ riverPaths, spacing, heightScale, tiles }) {
  const radius = spacing * 0.07;
  const lakeColor = "#3ec6ff";
  const lakeRadius = spacing * 0.3;
  const lakeThickness = 0.12;

  return (
    <>
      {/* Instanced Lakes */}
      <MemoInstancedLakes
        riverPaths={riverPaths}
        spacing={spacing}
        heightScale={heightScale}
        lakeRadius={lakeRadius}
        lakeThickness={lakeThickness}
        lakeColor={lakeColor}
      />

      {/* Individual River Paths */}
      {riverPaths.map((path, i) => {
        if (path.length < 2) return null; // Need at least 2 tiles for a river path
        return (
          <MemoRiverPathMesh
            key={`river-path-${i}`}
            path={path}
            spacing={spacing}
            heightScale={heightScale}
            radius={radius}
            color={riverStyles.color}
            tiles={tiles}
          />
        );
      })}
    </>
  );
}

const areLakePropsEqual = (prev, next) =>
  prev.riverPaths.length === next.riverPaths.length &&
  prev.spacing === next.spacing &&
  prev.heightScale === next.heightScale &&
  prev.lakeRadius === next.lakeRadius &&
  prev.lakeThickness === next.lakeThickness &&
  prev.lakeColor === next.lakeColor &&
  prev.riverPaths.every(
    (path, i) =>
      path.length > 0 &&
      next.riverPaths[i] &&
      next.riverPaths[i].length > 0 &&
      path[0].q === next.riverPaths[i][0].q &&
      path[0].r === next.riverPaths[i][0].r &&
      path[0].height === next.riverPaths[i][0].height
  );

const MemoInstancedLakes = React.memo(InstancedLakes, areLakePropsEqual);

const areRiverPropsEqual = (prev, next) =>
  prev.spacing === next.spacing &&
  prev.heightScale === next.heightScale &&
  prev.radius === next.radius &&
  prev.color === next.color &&
  prev.path.length === next.path.length &&
  prev.path.every(
    (tile, i) =>
      tile.q === next.path[i].q &&
      tile.r === next.path[i].r &&
      tile.height === next.path[i].height
  );

const MemoRiverPathMesh = React.memo(RiverPathMesh, areRiverPropsEqual);

export default React.memo(RiverLayer);
