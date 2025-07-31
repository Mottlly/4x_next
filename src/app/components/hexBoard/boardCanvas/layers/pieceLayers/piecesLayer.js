import React, { useRef, useEffect } from "react";
import { a, useSpring } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import hexToPosition from "../../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import { pieceTypeStyles } from "@/library/styles/stylesIndex";
import { Edges } from "@react-three/drei/web/Edges";
import ScoutMeepleGroup from "../../models/meeples/ScoutMeepleGroup";
import EngineerMeepleGroup from "../../models/meeples/EngineerMeepleGroup";
import RaiderMeepleGroup from "../../models/meeples/RaiderMeepleGroup";
import ArmedSettlerMeepleGroup from "../../models/meeples/ArmedSettlerMeepleGroup";
import SecurityMeepleGroup from "../../models/meeples/SecurityMeepleGroup";
import Pod from "../../models/pieces/Pod";
import UnitFloatingIcon from "../../models/icons/UnitFloatingIcon";
import Meeple from "../../models/meeples/Meeple";

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

  // Get the piece's health from stats
  const maxHealth = p.stats?.health;
  const currentHealth = p.stats?.currentHealth;
  const hasHealthStats = maxHealth !== null && currentHealth !== null;

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
      {/* Show health bar beside the icon if piece has health stats */}
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
      {p.type === "Pod" ? (
        <Pod selected={selectedPieceId === p.id} />
      ) : p.type === "Scout" ? (
        <ScoutMeepleGroup color={style.color} edgeColor="#222" />
      ) : p.type === "Engineer" ? (
        <EngineerMeepleGroup color={style.color} edgeColor="#222" />
      ) : p.type === "Armed_Settler" ? (
        <ArmedSettlerMeepleGroup color={style.color} edgeColor="#222" />
      ) : p.type === "Security" ? (
        <SecurityMeepleGroup color={style.color} edgeColor="#222" />
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
