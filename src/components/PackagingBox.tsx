import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createFoilMaterial, createGlassMaterial, createPaperMaterial } from "@/three/materials";
import { BRAND, scrollSceneStore } from "@/three/scene";

const PANEL = 1.1;
const WALL = 1.3;

type Axis = "x" | "z";

interface FlapConfig {
  hinge: [number, number, number];
  axis: Axis;
  meshPos: [number, number, number];
  size: [number, number, number];
  close: number;
  foil?: boolean;
}

const FLAPS: FlapConfig[] = [
  { hinge: [PANEL / 2, 0, 0], axis: "z", meshPos: [WALL / 2, WALL / 2, 0], size: [WALL, WALL, 0.02], close: -Math.PI / 2, foil: true },
  { hinge: [-PANEL / 2, 0, 0], axis: "z", meshPos: [-WALL / 2, WALL / 2, 0], size: [WALL, WALL, 0.02], close: Math.PI / 2 },
  { hinge: [0, 0, PANEL / 2], axis: "x", meshPos: [0, WALL / 2, WALL / 2], size: [PANEL, WALL, 0.02], close: Math.PI / 2 },
  { hinge: [0, 0, -PANEL / 2], axis: "x", meshPos: [0, WALL / 2, -WALL / 2], size: [PANEL, WALL, 0.02], close: -Math.PI / 2 },
];

export default function PackagingBox({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const flapRefs = useRef<(THREE.Group | null)[]>([]);
  const crossRef = useRef<THREE.Group>(null);

  const bodyMaterial = useMemo(() => createPaperMaterial(BRAND.paper), []);
  const foilMaterial = useMemo(() => createFoilMaterial(new THREE.Color("#f4efe2")), []);
  const crossMaterial = useMemo(() => createFoilMaterial(BRAND.cyan), []);
  const glassMaterial = useMemo(() => createGlassMaterial(), []);

  useFrame((state) => {
    const fold = reducedMotion ? 1 : THREE.MathUtils.clamp(scrollSceneStore.pharmaFold, 0, 1);
    const eased = fold * fold * (3 - 2 * fold);

    flapRefs.current.forEach((flap, i) => {
      if (!flap) return;
      const cfg = FLAPS[i];
      if (cfg.axis === "x") flap.rotation.x = cfg.close * eased;
      else flap.rotation.z = cfg.close * eased;
    });

    if (crossRef.current) {
      const s = THREE.MathUtils.clamp((eased - 0.6) / 0.4, 0, 1);
      crossRef.current.scale.setScalar(s);
    }

    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      const idle = reducedMotion ? 0 : Math.sin(t * 0.15) * 0.12;
      groupRef.current.rotation.y = idle + eased * 0.3;
      groupRef.current.position.y = reducedMotion ? 0 : Math.sin(t * 0.5) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.35, 0]}>
      <mesh material={bodyMaterial} receiveShadow castShadow>
        <boxGeometry args={[PANEL, 0.02, PANEL]} />
      </mesh>

      {FLAPS.map((cfg, i) => (
        <group
          key={i}
          position={cfg.hinge}
          ref={(el) => {
            flapRefs.current[i] = el;
          }}
        >
          <mesh material={cfg.foil ? foilMaterial : bodyMaterial} castShadow receiveShadow position={cfg.meshPos}>
            <boxGeometry args={cfg.size} />
          </mesh>
        </group>
      ))}

      <group ref={crossRef} position={[PANEL / 2 + 0.015, WALL / 2, 0]} scale={0}>
        <mesh material={crossMaterial}>
          <boxGeometry args={[0.34, 0.08, 0.03]} />
        </mesh>
        <mesh material={crossMaterial}>
          <boxGeometry args={[0.08, 0.34, 0.03]} />
        </mesh>
      </group>

      <mesh material={glassMaterial} position={[0, WALL / 2, PANEL / 2 + 0.05]}>
        <planeGeometry args={[0.5, 0.5]} />
      </mesh>
    </group>
  );
}
