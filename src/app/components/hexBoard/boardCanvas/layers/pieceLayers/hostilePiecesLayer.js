import React, { useRef, useEffect } from "react";
import { a, useSpring } from "@react-spring/three";
import hexToPosition from "../../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import { isTileVisible } from "../../../../../../library/utililies/game/tileUtilities/lineOfSight/isVisibleHelper";
import { pieceTypeStyles } from "@/library/styles/stylesIndex";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const HealthBar = ({
  health,
  maxHealth = 15,
  width = 0.7,
  height = 0.08,
  yOffset = 0.45,
}) => {
  const percent = Math.max(0, Math.min(1, health / maxHealth));
  const groupRef = useRef();
  useFrame(({ camera }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
  });

  // Solid color based on health percent
  let color = "#4caf50"; // green
  if (percent <= 0.25) color = "#e53935"; // red
  else if (percent <= 0.5) color = "#ffb300"; // yellow

  const borderColor = "#00bfff"; // Your UI blue

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* Blue border/board for the bar */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width + 0.04, height + 0.04]} />
        <meshBasicMaterial color={borderColor} transparent opacity={0.95} />
      </mesh>
      {/* Background bar */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#333" transparent opacity={0.85} />
      </mesh>
      {/* Health bar (foreground) */}
      <mesh position={[-(width * (1 - percent)) / 2, 0, 0.02]}>
        <planeGeometry args={[width * percent, height]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

const HostilePiece = React.memo(function HostilePiece({
  p,
  tile,
  spacing,
  heightScale,
  onTileClick,
  onPieceHover,
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
    // Fortress health bar
    const maxHealth = p.stats?.maxHealth || 15; // You can set maxHealth in your fortress stats if you want
    const health = p.stats?.health ?? maxHealth;
    return (
      <a.group position={spring.position}>
        <mesh
          key={`fortress-${p.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onTileClick?.(tile, p);
          }}
        >
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color="yellow" />
        </mesh>
        {/* Health bar above fortress */}
        <HealthBar health={health} maxHealth={maxHealth} yOffset={0.5} />
      </a.group>
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
      onPointerOver={(e) => {
        e.stopPropagation();
        onPieceHover?.(p, tile, e);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onPieceHover?.(null, null, e);
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
  onPieceHover,
}) {
  console.log("HostilePiecesLayer hostilePieces:", hostilePieces);
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
        if (!tile || !tile.visible || tile.semiFogged) return null;
        return (
          <HostilePiece
            key={p.id}
            p={p}
            tile={tile}
            spacing={spacing}
            heightScale={heightScale}
            onTileClick={onTileClick}
            onPieceHover={onPieceHover}
            prevPositions={prevPositions}
          />
        );
      })}
    </>
  );
}

export default React.memo(HostilePiecesLayer);
