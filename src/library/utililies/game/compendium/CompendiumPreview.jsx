import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

// Import 3D models
import Pod from "@/app/components/hexBoard/boardCanvas/models/pieces/Pod";
import ScoutMeepleGroup from "@/app/components/hexBoard/boardCanvas/models/meeples/ScoutMeepleGroup";
import EngineerMeepleGroup from "@/app/components/hexBoard/boardCanvas/models/meeples/EngineerMeepleGroup";
import RaiderMeepleGroup from "@/app/components/hexBoard/boardCanvas/models/meeples/RaiderMeepleGroup";
import ArmedSettlerMeepleGroup from "@/app/components/hexBoard/boardCanvas/models/meeples/ArmedSettlerMeepleGroup";
import SecurityMeepleGroup from "@/app/components/hexBoard/boardCanvas/models/meeples/SecurityMeepleGroup";
import ColonySettlementMesh from "@/app/components/hexBoard/boardCanvas/models/buildings/colonySettlementMesh";
import ReconstructedShelterMesh from "@/app/components/hexBoard/boardCanvas/models/buildings/reconstructedShelterMesh";
import ResourceExtractorMesh from "@/app/components/hexBoard/boardCanvas/models/buildings/resourceExtractorMesh";
import SensorSuiteMesh from "@/app/components/hexBoard/boardCanvas/models/buildings/SensorSuiteMesh";
import HostileFortressMesh from "@/app/components/hexBoard/boardCanvas/models/buildings/hostileFortressMesh";

// Import terrain models
import PineTreeMesh from "@/app/components/hexBoard/boardCanvas/models/terrain/pineTreeMesh";
import MountainMesh from "@/app/components/hexBoard/boardCanvas/models/terrain/mountainMesh";
import TallGrassPatch from "@/app/components/hexBoard/boardCanvas/models/terrain/tallGrassPatch";
import BerryBush from "@/app/components/hexBoard/boardCanvas/models/terrain/berryBush";

/**
 * 3D Preview component for compendium entries
 * Displays a rotating 3D model of the selected item
 */

// Rotating wrapper for models
function RotatingModel({ children, autoRotate = true }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

// Terrain tile component
function TerrainTile({ type, color }) {
  const tileRef = useRef();

  useFrame((state, delta) => {
    if (tileRef.current) {
      tileRef.current.rotation.y += delta * 0.2;
    }
  });

  // Get terrain-specific geometry
  const getTerrainGeometry = (terrainType) => {
    switch (terrainType) {
      case "mountain":
      case "impassable mountain":
        return (
          <group>
            {/* Base hexagon */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[1, 1, 0.3, 6]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Mountain meshes */}
            <MountainMesh position={[0.2, 0.15, 0.3]} scale={0.8} />
            <MountainMesh position={[-0.4, 0.15, -0.2]} scale={0.6} />
            <MountainMesh position={[0.3, 0.15, -0.4]} scale={0.7} />
          </group>
        );
      case "forest":
        return (
          <group>
            {/* Base hexagon */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[1, 1, 0.3, 6]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Pine trees scattered across the tile */}
            <PineTreeMesh position={[0.3, 0.15, 0.2]} scale={0.8} />
            <PineTreeMesh position={[-0.2, 0.15, -0.3]} scale={0.6} />
            <PineTreeMesh position={[0.1, 0.15, -0.1]} scale={0.9} />
            <PineTreeMesh position={[-0.4, 0.15, 0.3]} scale={0.7} />
            <PineTreeMesh position={[0.4, 0.15, -0.4]} scale={0.5} />
            <PineTreeMesh position={[-0.1, 0.15, 0.4]} scale={0.8} />
            {/* Add some berry bushes for variation */}
            <BerryBush position={[0.5, 0.15, 0.1]} scale={0.6} />
            <BerryBush position={[-0.3, 0.15, 0.5]} scale={0.4} />
          </group>
        );
      case "grassland":
        return (
          <group>
            {/* Base hexagon */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[1, 1, 0.3, 6]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Grass patches */}
            <TallGrassPatch position={[0.2, 0.15, 0.3]} scale={0.8} />
            <TallGrassPatch position={[-0.3, 0.15, -0.2]} scale={0.6} />
            <TallGrassPatch position={[0.4, 0.15, -0.4]} scale={0.7} />
            <TallGrassPatch position={[-0.4, 0.15, 0.4]} scale={0.5} />
            <TallGrassPatch position={[0.1, 0.15, -0.1]} scale={0.9} />
          </group>
        );
      case "plains":
        return (
          <group>
            {/* Base hexagon */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[1, 1, 0.3, 6]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Scattered grass patches */}
            <TallGrassPatch position={[0.3, 0.15, 0.2]} scale={0.4} />
            <TallGrassPatch position={[-0.2, 0.15, -0.3]} scale={0.3} />
            <TallGrassPatch position={[0.1, 0.15, 0.4]} scale={0.5} />
          </group>
        );
      case "water":
      case "lake":
        return (
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[1, 1, 0.2, 6]} />
            <meshPhysicalMaterial
              color={color}
              transparent
              opacity={0.8}
              roughness={0.1}
              metalness={0.1}
            />
          </mesh>
        );
      default:
        return (
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[1, 1, 0.3, 6]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
    }
  };

  return <group ref={tileRef}>{getTerrainGeometry(type)}</group>;
}

// Main preview component
function CompendiumPreview({ modelType, modelData, className = "" }) {
  const renderModel = () => {
    switch (modelType) {
      case "piece":
        return renderPieceModel(modelData);
      case "hostile":
        return renderHostileModel(modelData);
      case "building":
        return renderBuildingModel(modelData);
      case "terrain":
        return (
          <RotatingModel>
            <TerrainTile type={modelData.type} color={modelData.color} />
          </RotatingModel>
        );
      default:
        return (
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#666" />
          </mesh>
        );
    }
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [3, 3, 3], fov: 50 }}
        style={{ background: "#0f172a" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-5, 3, -5]} intensity={0.3} />

          {renderModel()}

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={8}
            maxPolarAngle={Math.PI / 2}
          />

          <Environment preset="dawn" />
        </Suspense>
      </Canvas>
    </div>
  );
}

function renderPieceModel(modelData) {
  const { type, color } = modelData;

  switch (type) {
    case "Pod":
      return (
        <RotatingModel>
          <Pod scale={1.2} />
        </RotatingModel>
      );
    case "Scout":
      return (
        <RotatingModel>
          <ScoutMeepleGroup color={color} edgeColor="#222" />
        </RotatingModel>
      );
    case "Engineer":
      return (
        <RotatingModel>
          <EngineerMeepleGroup color={color} edgeColor="#222" />
        </RotatingModel>
      );
    case "Security":
      return (
        <RotatingModel>
          <SecurityMeepleGroup color={color} edgeColor="#222" />
        </RotatingModel>
      );
    case "Armed_Settler":
      return (
        <RotatingModel>
          <ArmedSettlerMeepleGroup color={color} edgeColor="#222" />
        </RotatingModel>
      );
    default:
      return (
        <RotatingModel>
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </RotatingModel>
      );
  }
}

function renderHostileModel(modelData) {
  const { type, color } = modelData;

  switch (type) {
    case "Raider":
      return (
        <RotatingModel>
          <RaiderMeepleGroup color={color} edgeColor="#222" />
        </RotatingModel>
      );
    case "hostileFortress":
      return (
        <RotatingModel>
          <HostileFortressMesh scale={1.2} />
        </RotatingModel>
      );
    default:
      return (
        <RotatingModel>
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </RotatingModel>
      );
  }
}

function renderBuildingModel(modelData) {
  const { type, color } = modelData;

  switch (type) {
    case "reconstructed_shelter":
      return (
        <RotatingModel>
          <ReconstructedShelterMesh scale={1.2} />
        </RotatingModel>
      );
    case "resource_extractor":
      return (
        <RotatingModel>
          <ResourceExtractorMesh scale={1.2} />
        </RotatingModel>
      );
    case "sensor_suite":
      return (
        <RotatingModel>
          <SensorSuiteMesh scale={1.2} />
        </RotatingModel>
      );
    case "colony_settlement":
      return (
        <RotatingModel>
          <ColonySettlementMesh scale={1.2} />
        </RotatingModel>
      );
    default:
      return (
        <RotatingModel>
          <mesh>
            <cylinderGeometry args={[0.4, 0.4, 0.8, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </RotatingModel>
      );
  }
}

export default CompendiumPreview;
