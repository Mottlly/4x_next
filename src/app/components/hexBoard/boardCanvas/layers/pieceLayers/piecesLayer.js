import React, { useRef, useEffect } from "react";
import { a, useSpring } from "@react-spring/three";
import hexToPosition from "../../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import { pieceTypeStyles } from "@/library/styles/stylesIndex";
import { Edges } from "@react-three/drei";
import ScoutMeepleGroup from "../../models/ScoutMeepleGroup";
import EngineerMeepleGroup from "../../models/EngineerMeepleGroup";
import RaiderMeepleGroup from "../../models/RaiderMeepleGroup";
import UnitFloatingIcon from "../../models/icons/UnitFloatingIcon";
import Meeple from "../../models/meeples/Meeple";

const Piece = React.memo(function Piece({
  p,
  tile,
  selectedPieceId,
  heightScale,
  spacing,
  onTileClick,
  prevPositions,
}) {
  const [x, , z] = hexToPosition(p.q, p.r, spacing);
  const y = tile.height * heightScale + 0.5;
  const style =
    selectedPieceId === p.id
      ? { color: "yellow" }
      : pieceTypeStyles[p.type] || pieceTypeStyles.default;

  const prev = prevPositions.current[p.id] || [x, y, z];
  const spring = useSpring({
    position: [x, y, z],
    from: { position: prev },
    config: { mass: 1, tension: 170, friction: 26 },
  });

  return (
    <a.group
      key={`piece-${p.id}`}
      position={spring.position}
      onClick={(e) => {
        e.stopPropagation();
        onTileClick(tile);
      }}
    >
      <UnitFloatingIcon type={p.type} />
      {p.type === "Scout" ? (
        <ScoutMeepleGroup color={style.color} edgeColor="#222" />
      ) : p.type === "Engineer" ? (
        <EngineerMeepleGroup color={style.color} edgeColor="#222" />
      ) : p.type === "Raider" ? (
        <RaiderMeepleGroup color={style.color} edgeColor="#222" />
      ) : (
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
          <meshStandardMaterial color={style.color} />
        </mesh>
      )}
    </a.group>
  );
});

const PiecesLayer = React.memo(function PiecesLayer({
  pieces,
  selectedPieceId,
  tiles,
  spacing,
  heightScale,
  onTileClick,
}) {
  const prevPositions = useRef({});

  useEffect(() => {
    pieces.forEach((p) => {
      prevPositions.current[p.id] = hexToPosition(p.q, p.r, spacing);
    });
  }, [pieces, spacing]);

  return (
    <>
      {pieces.map((p) => {
        const tile = tiles.find((t) => t.q === p.q && t.r === p.r);
        if (!tile) return null;
        return (
          <Piece
            key={p.id}
            p={p}
            tile={tile}
            selectedPieceId={selectedPieceId}
            heightScale={heightScale}
            spacing={spacing}
            onTileClick={onTileClick}
            prevPositions={prevPositions}
          />
        );
      })}
    </>
  );
});

export default PiecesLayer;
