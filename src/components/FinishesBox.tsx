import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { scrollSceneStore } from "@/three/scene";

import finishGold from "@/assets/finish-gold.jpg";
import finishSpotUv from "@/assets/finish-spotuv.jpg";
import finishKraft from "@/assets/finish-kraft.jpg";
import finishHolo from "@/assets/finish-holo.jpg";

export type FinishType = "gold" | "spotuv" | "kraft" | "holo";

interface FinishesBoxProps {
  finish: FinishType;
  reducedMotion: boolean;
}

export default function FinishesBox({ finish, reducedMotion }: FinishesBoxProps) {
  const group = useRef<THREE.Group>(null);
  const cardMesh = useRef<THREE.Mesh>(null);

  // Load the 4 authentic high-res finish textures
  const goldTexture = useLoader(TextureLoader, finishGold);
  const spotUvTexture = useLoader(TextureLoader, finishSpotUv);
  const kraftTexture = useLoader(TextureLoader, finishKraft);
  const holoTexture = useLoader(TextureLoader, finishHolo);

  const currentTexture = useMemo(() => {
    switch (finish) {
      case "gold":
        return goldTexture;
      case "spotuv":
        return spotUvTexture;
      case "kraft":
        return kraftTexture;
      case "holo":
        return holoTexture;
      default:
        return goldTexture;
    }
  }, [finish, goldTexture, spotUvTexture, kraftTexture, holoTexture]);

  // Finishes physical material parameters
  const matConfig = useMemo(() => {
    switch (finish) {
      case "gold":
        return {
          baseColor: "#12141c",
          roughness: 0.25,
          metalness: 0.85,
          clearcoat: 0.8,
        };
      case "spotuv":
        return {
          baseColor: "#0f1118",
          roughness: 0.15,
          metalness: 0.3,
          clearcoat: 1.0,
        };
      case "kraft":
        return {
          baseColor: "#8f693e",
          roughness: 0.85,
          metalness: 0.05,
          clearcoat: 0.0,
        };
      case "holo":
        return {
          baseColor: "#0f1422",
          roughness: 0.2,
          metalness: 0.75,
          clearcoat: 1.0,
        };
      default:
        return {
          baseColor: "#12141c",
          roughness: 0.3,
          metalness: 0.5,
          clearcoat: 0.5,
        };
    }
  }, [finish]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const p = reducedMotion ? 0.5 : scrollSceneStore.finishesScroll;
    const ptrX = scrollSceneStore.pointer.x;
    const ptrY = scrollSceneStore.pointer.y;

    // Scroll drives 3D orientation; mouse pointer adds organic light gleam
    const targetRotY = reducedMotion ? -0.2 : (p - 0.5) * Math.PI * 1.5 + ptrX * 0.45;
    const targetRotX = reducedMotion ? 0.1 : (p - 0.5) * -0.4 + ptrY * -0.3;
    const floatY = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 1.8) * 0.06;

    const damp = Math.min(1, delta * 4);
    group.current.rotation.y += (targetRotY - group.current.rotation.y) * damp;
    group.current.rotation.x += (targetRotX - group.current.rotation.x) * damp;
    group.current.position.y += (floatY - group.current.position.y) * damp;
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* 3D Premium Box Chassis */}
      <mesh ref={cardMesh} castShadow receiveShadow>
        <boxGeometry args={[2.7, 3.8, 0.35]} />
        <meshStandardMaterial
          color={matConfig.baseColor}
          roughness={matConfig.roughness}
          metalness={matConfig.metalness}
        />
      </mesh>

      {/* Front Face with Real Texture Image */}
      <mesh position={[0, 0, 0.178]} castShadow>
        <planeGeometry args={[2.6, 3.7]} />
        <meshPhysicalMaterial
          map={currentTexture}
          roughness={matConfig.roughness}
          metalness={matConfig.metalness}
          clearcoat={matConfig.clearcoat}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </mesh>

      {/* Back Face with Texture */}
      <mesh position={[0, 0, -0.178]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.6, 3.7]} />
        <meshStandardMaterial
          map={currentTexture}
          roughness={matConfig.roughness}
          metalness={matConfig.metalness}
        />
      </mesh>

      {/* Beveled Edge Highlight */}
      <mesh position={[1.34, 0, 0]}>
        <boxGeometry args={[0.02, 3.8, 0.36]} />
        <meshStandardMaterial
          color={finish === "gold" ? "#fde047" : finish === "holo" ? "#38bdf8" : "#94a3b8"}
          emissive={finish === "gold" ? "#eab308" : finish === "holo" ? "#0284c7" : "#475569"}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
