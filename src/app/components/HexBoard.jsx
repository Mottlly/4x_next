import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import Bestagon from "@/app/components/bestagon";
import TileInfoPanel from "../components/gameUI/infoTile";

// 1) Returns a hex color string based on the given tile type.
const getColorForType = (type) => {
  switch (type) {
    case "water":
      return "#4169E1"; // Water color
    case "lake":
      return "#007BA7"; // Lake color
    case "forest":
      return "#228B22"; // Forest color
    case "desert":
      return "#EDC9Af"; // Desert color
    case "mountain":
      return "#A9A9A9"; // Mountain color
    case "impassable mountain":
      return "#555555"; // Impassable mountain color
    case "plains":
      return "#90EE90"; // Plains color
    default:
      return "#CCCCCC"; // Default color
  }
};

// 2) Converts axial hex coordinates (q, r) to a 3D world position (x, y, z).
export const hexToPosition = (q, r, spacing) => {
  const xOffset = spacing * 1.65; // Horizontal spacing multiplier
  const zOffset = spacing * 1.42; // Vertical spacing multiplier
  return [q * xOffset + (r % 2) * (xOffset / 2), 0, -r * zOffset]; // y is 0; z is negative for increasing r
};

// 3) Builds an extruded fog wall around the board with an outer margin (extends far from the board).
const ExtrudedFogMask = ({ board, spacing, wallHeight = 5 }) => {
  const ref = useRef();

  useEffect(() => {
    const tileRadius = spacing; // Use spacing as the approximate tile radius

    let minX = Infinity,
      maxX = -Infinity,
      minZ = Infinity,
      maxZ = -Infinity;
    // Compute board boundaries expanded by tile radius so the whole tile is included.
    board.tiles.forEach((tile) => {
      const [cx, , cz] = hexToPosition(tile.q, tile.r, spacing);
      const left = cx - tileRadius;
      const right = cx + tileRadius;
      if (left < minX) minX = left;
      if (right > maxX) maxX = right;
      const top = cz + tileRadius;
      const bottom = cz - tileRadius;
      if (bottom < minZ) minZ = bottom;
      if (top > maxZ) maxZ = top;
    });

    const extra = 100; // Extend outer margin to push mask edges further out
    // Create the outer shape in 2D (using x and -z for proper orientation after rotation).
    const outerShape = new THREE.Shape();
    outerShape.moveTo(minX - extra, -(maxZ + extra));
    outerShape.lineTo(maxX + extra, -(maxZ + extra));
    outerShape.lineTo(maxX + extra, -(minZ - extra));
    outerShape.lineTo(minX - extra, -(minZ - extra));
    outerShape.lineTo(minX - extra, -(maxZ + extra));

    // Create a hole in the shape that matches the board area.
    const hole = new THREE.Path();
    hole.moveTo(minX, -maxZ);
    hole.lineTo(maxX, -maxZ);
    hole.lineTo(maxX, -minZ);
    hole.lineTo(minX, -minZ);
    hole.lineTo(minX, -maxZ);
    outerShape.holes.push(hole);

    // Extrude the 2D shape to create a 3D wall from y=0 up to y=wallHeight.
    const extrudeSettings = {
      depth: wallHeight, // Sets vertical wall height
      steps: 1,
      bevelEnabled: false,
    };
    const geometry = new THREE.ExtrudeGeometry(outerShape, extrudeSettings);

    // Rotate so that extrusion goes upward along world +Y.
    geometry.rotateX(-Math.PI / 2);

    // Shift geometry so that its bottom aligns with y=0.
    geometry.computeBoundingBox();
    const bb = geometry.boundingBox;
    const minY = bb.min.y;
    if (minY < 0) geometry.translate(0, -minY, 0);

    // Update the mesh's geometry.
    if (ref.current) {
      ref.current.geometry?.dispose();
      ref.current.geometry = geometry;
    }
  }, [board, spacing, wallHeight]);

  return (
    <mesh ref={ref} position={[0, 0, 0]} renderOrder={999}>
      <meshBasicMaterial
        color="#000000" // Mask color
        opacity={0.8} // Slight transparency
        transparent
        depthWrite={false}
        side={THREE.DoubleSide} // Render both sides of the wall
      />
    </mesh>
  );
};

// 4) Renders the interactive hex board with tiles (and optional river elements).
const InteractiveBoard = ({ board, setHoveredTile, isDraggingRef }) => {
  const groupRef = useRef();
  const previousTileRef = useRef(null);
  const heightScale = 0.5; // Scale height differences for 3D effect
  const elements = [];

  const handlePointerMove = (event) => {
    if (isDraggingRef.current) return;
    event.stopPropagation();
    const intersect = event.intersections?.[0];
    const tile = intersect?.object?.userData?.tile || null;
    const prev = previousTileRef.current;
    // Ignore repeated events on the same tile.
    if (
      tile &&
      prev &&
      tile.q === prev.q &&
      tile.r === prev.r &&
      tile.type === prev.type
    )
      return;
    previousTileRef.current = tile;
    setHoveredTile(tile); // Update hovered tile info
  };

  // Create a Bestagon tile (plus optional river spheres) for each tile in the board.
  board.tiles.forEach((tile) => {
    const { q, r, type, height, river } = tile;
    const pos = hexToPosition(q, r, board.spacing);
    const color = getColorForType(type);
    elements.push(
      <group key={`tile-${q}-${r}`}>
        <Bestagon
          position={[pos[0], height * heightScale, pos[2]]}
          color={color}
          userData={{ tile: { q, r, type, height, river } }}
        />
        {river && (
          <mesh position={[pos[0], height * heightScale + 0.1, pos[2]]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#0000FF" />
          </mesh>
        )}
      </group>
    );
  });

  return (
    <group ref={groupRef} onPointerMove={handlePointerMove}>
      {elements}
    </group>
  );
};

// 5) Switches between sci-fi and nature background audio based on camera height.
const AudioSwitcher = ({ threshold, sciFiAudioRef, natureAudioRef }) => {
  const { camera } = useThree();
  useFrame(() => {
    if (!sciFiAudioRef.current || !natureAudioRef.current) return;
    if (camera.position.y < threshold) {
      if (natureAudioRef.current.paused) {
        natureAudioRef.current.play().catch(() => {});
      }
      if (!sciFiAudioRef.current.paused) {
        sciFiAudioRef.current.pause();
      }
    } else {
      if (sciFiAudioRef.current.paused) {
        sciFiAudioRef.current.play().catch(() => {});
      }
      if (!natureAudioRef.current.paused) {
        natureAudioRef.current.pause();
      }
    }
  });
  return null;
};

// 6) Main HexBoard component: Sets up the canvas with tiles, fog mask, controls, and audio.
export default function HexBoard({ board, threshold = 8 }) {
  const [hoveredTile, setHoveredTile] = useState(null);
  const isDraggingRef = useRef(false);
  const dragTimeoutRef = useRef(null);
  const sciFiAudioRef = useRef(null);
  const natureAudioRef = useRef(null);

  // Load and set up background audio on mount.
  useEffect(() => {
    const sciFiAudio = new Audio("/music/sci-fi_loop.wav");
    sciFiAudio.loop = true;
    const natureAudio = new Audio("/music/nature_loop.wav");
    natureAudio.loop = true;
    const savedVolume = localStorage.getItem("musicVolume");
    const volume = savedVolume ? parseFloat(savedVolume) : 0.3;
    sciFiAudio.volume = volume;
    natureAudio.volume = volume;
    sciFiAudioRef.current = sciFiAudio;
    natureAudioRef.current = natureAudio;

    const tryPlay = () => {
      sciFiAudio
        .play()
        .catch((err) => console.log("Unable to play sci-fi audio:", err));
      natureAudio.pause();
      window.removeEventListener("click", tryPlay);
    };
    window.addEventListener("click", tryPlay);

    return () => {
      sciFiAudio.pause();
      sciFiAudio.currentTime = 0;
      natureAudio.pause();
      natureAudio.currentTime = 0;
      window.removeEventListener("click", tryPlay);
    };
  }, []);

  // Manage pointer drag state.
  const handlePointerDown = () => {
    isDraggingRef.current = true;
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
  };
  const handlePointerUp = () => {
    dragTimeoutRef.current = setTimeout(() => {
      isDraggingRef.current = false;
      dragTimeoutRef.current = null;
    }, 800);
  };

  return (
    <div className="relative">
      <Canvas
        camera={{ position: [10, 10, 15] }} // Initial camera position
        style={{ width: "100vw", height: "100vh" }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <ambientLight intensity={0.5} /> {/* Global ambient lighting */}
        <pointLight position={[10, 20, 10]} />{" "}
        {/* Point light for more dynamic lighting */}
        {/* Render the hex board tiles */}
        <InteractiveBoard
          board={board}
          setHoveredTile={setHoveredTile}
          isDraggingRef={isDraggingRef}
        />
        {/* Enable orbit controls with damping and set angle limits */}
        <MapControls
          enableDamping
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 4}
        />
        {/* Toggle the background audio based on camera height */}
        <AudioSwitcher
          threshold={threshold}
          sciFiAudioRef={sciFiAudioRef}
          natureAudioRef={natureAudioRef}
        />
        {/* Render the extruded fog mask (the black wall around the board) */}
        <ExtrudedFogMask board={board} spacing={board.spacing} wallHeight={5} />
      </Canvas>
      <TileInfoPanel tile={hoveredTile} />{" "}
      {/* Display info for the hovered tile */}
    </div>
  );
}
