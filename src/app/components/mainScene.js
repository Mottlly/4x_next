"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 60 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 5, 3]} intensity={1} />
      <OrbitControls />

      {/* 3D Object - A simple rotating cube */}
      <mesh rotation={[0.4, 0.2, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="royalblue" />
      </mesh>
    </Canvas>
  );
}

export default function ThreeScene() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Scene />
    </Suspense>
  );
}
