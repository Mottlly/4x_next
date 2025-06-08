"use client";

import React, { useRef, useState, useMemo } from "react";
import { Edges } from "@react-three/drei";
import { tileTypeStyles } from "@/library/styles/stylesIndex";
import getNeighborHeights from "@/library/utililies/game/tileUtilities/getNeighborHeights";
import whichVerticesShouldSlope from "@/library/utililies/game/tileUtilities/whichVerticesShouldSlope";
import hexPrismGeometry from "./hexPrismGeometry";
import * as THREE from "three";

const HEIGHT_THRESHOLD = 0.1;

const Bestagon = ({
  position,
  userData,
  onClick: onExternalClick,
  spacing = 1,
  boardTiles,
  heightScale = 0.5,
}) => {
  const meshRef = useRef();
  const [selected, setSelected] = useState(false);

  const tileType = userData?.tile?.type || "default";
  const style = tileTypeStyles[tileType] || tileTypeStyles.default;
  const thickness = style.geometry.args[2];

  const tileHeight = userData.tile.height;
  const tileY = tileHeight * heightScale;
  const neighborHeightsRaw = getNeighborHeights(userData.tile, boardTiles);
  const isEvenRow = userData.tile.r % 2 === 0;
  // Map neighborHeightsRaw to [E, SE, SW, W, NW, NE]
  const neighborHeights = [
    neighborHeightsRaw[3], // E
    neighborHeightsRaw[5], // SE
    neighborHeightsRaw[4], // SW
    neighborHeightsRaw[2], // W
    neighborHeightsRaw[0], // NW
    neighborHeightsRaw[1], // NE
  ];

  const slopeVertices = whichVerticesShouldSlope(
    tileHeight,
    neighborHeights,
    HEIGHT_THRESHOLD
  );

  const vertexOrder = [0, 1, 2, 3, 4, 5];

  // For each vertex, if it should slope, set to the *lowest* adjacent neighbor's height; else, keep at tile height
  const topYList = vertexOrder.map((i) => {
    if (!slopeVertices[i]) return 0;
    const neighborPairs = [
      [0, 5], // a
      [0, 1], // b
      [1, 2], // c
      [2, 3], // d
      [3, 4], // e
      [4, 5], // f
    ];
    const [ni1, ni2] = neighborPairs[i];
    const nh1 = neighborHeights[ni1];
    const nh2 = neighborHeights[ni2];
    const candidates = [nh1, nh2].filter(
      (nh) => nh !== null && tileHeight - nh > HEIGHT_THRESHOLD
    );
    if (candidates.length === 0) return 0;
    const lowest = Math.min(...candidates);
    return lowest * heightScale - tileY;
  });

  // Memoize geometry
  const geometry = useMemo(
    () => hexPrismGeometry(spacing, thickness),
    [spacing, thickness]
  );

  const handleClick = (event) => {
    event.stopPropagation();
    setSelected((sel) => !sel);
    if (meshRef.current) {
      meshRef.current.userData.selected = !selected;
    }
    if (onExternalClick) {
      onExternalClick(userData.tile);
    }
  };

  console.log(
    "Tile",
    userData.tile.q,
    userData.tile.r,
    "tileHeight:",
    tileHeight,
    "neighborHeights:",
    neighborHeights,
    "slopeVertices:",
    slopeVertices,
    "vertexOrder:",
    vertexOrder
  );

  // For each geometry vertex, print which logical vertex it maps to and the neighbors checked:
  vertexOrder.forEach((i, geoIdx) => {
    const neighborPairs = [
      [0, 5], // a
      [0, 1], // b
      [1, 2], // c
      [2, 3], // d
      [3, 4], // e
      [4, 5], // f
    ];
    const [ni1, ni2] = neighborPairs[i];
    console.log(
      `geoVert ${geoIdx}: logicalVert ${i}, neighbors ${ni1},${ni2}, heights:`,
      neighborHeights[ni1],
      neighborHeights[ni2],
      "shouldDrop:",
      slopeVertices[i]
    );
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      userData={userData}
      rotation={[0, Math.PI / 6, 0]}
      geometry={geometry}
    >
      <meshStandardMaterial color={style.color} side={THREE.DoubleSide} />
      <Edges color={style.edgeColor} />
    </mesh>
  );
};

export default Bestagon;
