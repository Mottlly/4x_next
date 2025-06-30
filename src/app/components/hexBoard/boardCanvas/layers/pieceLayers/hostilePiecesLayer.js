import React, { useRef, useEffect } from "react";
import { a, useSpring } from "@react-spring/three";
import hexToPosition from "../../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import { isTileVisible } from "../../../../../../library/utililies/game/tileUtilities/lineOfSight/isVisibleHelper";
import { pieceTypeStyles } from "@/library/styles/stylesIndex";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import HostileFortressMesh from "../../models/buildings/hostileFortressMesh";
import RaiderMeepleGroup from "../../models/meeples/RaiderMeepleGroup";
import UnitFloatingIcon from "../../models/icons/UnitFloatingIcon";

const HealthBar = ({
  health,
  maxHealth = 15,
  width = 0.7,
  height = 0.08,
  yOffset = 0.45,
  vertical = false,
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

  // Swap width/height for vertical, and adjust bar fill direction
  const barWidth = vertical ? height : width;
  const barHeight = vertical ? width : height;

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* Border */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[barWidth + 0.04, barHeight + 0.04]} />
        <meshBasicMaterial color={borderColor} transparent opacity={0.95} />
      </mesh>
      {/* Background */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[barWidth, barHeight]} />
        <meshBasicMaterial color="#333" transparent opacity={0.85} />
      </mesh>
      {/* Foreground (health) */}
      <mesh
        position={
          vertical
            ? [0, -(barHeight * (1 - percent)) / 2, 0.02]
            : [-(barWidth * (1 - percent)) / 2, 0, 0.02]
        }
      >
        <planeGeometry
          args={
            vertical
              ? [barWidth, barHeight * percent]
              : [barWidth * percent, barHeight]
          }
        />
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
  }, [p.id, x, y, z, prevPositions]);

  if (p.type === "hostileFortress") {
    // Fortress health bar
    const maxHealth = p.stats?.health;
    const currentHealth = p.stats?.currentHealth;
    const hasHealthStats = maxHealth !== null && currentHealth !== null;

    return (
      <a.group position={spring.position}>
        <HostileFortressMesh scale={0.7} />
        {/* Floating icon above fortress */}
        <UnitFloatingIcon type="hostileFortress" yOffset={0.7} />
        {/* Vertical health bar beside the icon */}
        {hasHealthStats && (
          <group position={[0.26, 0.7, 0]}>
            <HealthBar
              health={currentHealth}
              maxHealth={maxHealth}
              yOffset={0}
              vertical
            />
          </group>
        )}
      </a.group>
    );
  }

  // --- NEW: Render Raider as a Meeple with Axe and Sword ---
  if (p.type === "Raider") {
    // Get actual health stats
    const maxHealth = p.stats?.health;
    const currentHealth = p.stats?.currentHealth;
    const hasHealthStats = maxHealth !== null && currentHealth !== null;

    return (
      <a.group position={spring.position}>
        <RaiderMeepleGroup color={style.color} edgeColor="#222" />
        <UnitFloatingIcon type="Raider" yOffset={0.7} />
        {/* Show health bar beside the icon if has health stats */}
        {hasHealthStats && (
          <group position={[0.3, 0.7, 0]}>
            <HealthBar
              health={currentHealth}
              maxHealth={maxHealth}
              yOffset={0}
              vertical
              width={0.6}
              height={0.07}
            />
          </group>
        )}
      </a.group>
    );
  }

  // For other hostile piece types
  const maxHealth = p.stats?.health;
  const currentHealth = p.stats?.currentHealth;
  const hasHealthStats = maxHealth !== null && currentHealth !== null;

  return (
    <a.group
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
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
        <meshStandardMaterial color={style.color} />
      </mesh>
      <UnitFloatingIcon type={p.type} yOffset={0.7} />
      {/* Show health bar beside the icon if has health stats */}
      {hasHealthStats && (
        <group position={[0.3, 0.7, 0]}>
          <HealthBar
            health={currentHealth}
            maxHealth={maxHealth}
            yOffset={0}
            vertical
            width={0.6}
            height={0.07}
          />
        </group>
      )}
    </a.group>
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
