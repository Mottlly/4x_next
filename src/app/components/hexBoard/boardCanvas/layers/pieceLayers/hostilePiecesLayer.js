import React, { useRef, useEffect } from "react";
import { a, useSpring } from "@react-spring/three";
import hexToPosition from "../../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import { isTileVisible } from "../../../../../../library/utililies/game/tileUtilities/lineOfSight/isVisibleHelper";
import { pieceTypeStyles } from "@/library/styles/stylesIndex";

const HostilePiece = React.memo(function HostilePiece({
  p,
  tile,
  spacing,
  heightScale,
  onTileClick,
  prevPositions,
}) {
  const [x, , z] = hexToPosition(p.q, p.r, spacing);
  const y = tile.height * heightScale + 0.5;
  const style = pieceTypeStyles[p.type] || { color: "purple" };

  const prev = prevPositions.current[p.id] || [x, y, z];
  const spring = useSpring({
    position: [x, y, z],
    from: { position: prev },
    config: { mass: 1, tension: 170, friction: 26 },
  });

  useEffect(() => {
    prevPositions.current[p.id] = [x, y, z];
  }, [p.id, x, y, z]);

  if (p.type === "hostileFortress") {
    return (
      <a.mesh
        key={`fortress-${p.id}`}
        position={spring.position}
        onClick={(e) => {
          e.stopPropagation();
          onTileClick?.(tile, p);
        }}
      >
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color="darkred" />
      </a.mesh>
    );
  }

  return (
    <a.mesh
      key={`hostile-piece-${p.id}`}
      position={spring.position}
      onClick={(e) => {
        e.stopPropagation();
        onTileClick?.(tile, p);
      }}
    >
      <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
      <meshStandardMaterial color={style.color} />
    </a.mesh>
  );
});

function HostilePiecesLayer({
  hostilePieces,
  tiles,
  spacing,
  heightScale,
  onTileClick,
}) {
  const prevPositions = useRef({});

  useEffect(() => {
    hostilePieces.forEach((p) => {
      const [x, , z] = hexToPosition(p.q, p.r, spacing);
      const tile = tiles.find((t) => t.q === p.q && t.r === p.r);
      if (tile) {
        const y = tile.height * heightScale + 0.5;
        prevPositions.current[p.id] = [x, y, z];
      }
    });
  }, [hostilePieces, tiles, spacing, heightScale]);

  return (
    <>
      {hostilePieces.map((p) => {
        const tile = tiles.find((t) => t.q === p.q && t.r === p.r);
        // Only show if tile is visible and NOT semi-fogged
        if (!tile || !tile.visible || tile.semiFogged) return null;
        return (
          <HostilePiece
            key={p.id}
            p={p}
            tile={tile}
            spacing={spacing}
            heightScale={heightScale}
            onTileClick={onTileClick}
            prevPositions={prevPositions}
          />
        );
      })}
    </>
  );
}

export default React.memo(HostilePiecesLayer);
