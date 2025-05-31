import React, { useRef, useEffect } from "react";
import { a, useSpring } from "@react-spring/three";
import hexToPosition from "../../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import { pieceTypeStyles } from "@/library/styles/stylesIndex";

// Single animated piece component
function Piece({
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

  // Animate from previous position to new position
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
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
        <meshStandardMaterial color={style.color} />
      </mesh>
    </a.group>
  );
}

function PiecesLayer({
  pieces,
  selectedPieceId,
  tiles,
  spacing,
  heightScale,
  onTileClick,
}) {
  // Track previous positions for animation
  const prevPositions = useRef({});

  useEffect(() => {
    // Update previous positions after every render
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
}

export default React.memo(PiecesLayer);
