import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createInkMaterial, createPaperMaterial } from "@/three/materials";
import { INK_COLORS, scrollSceneStore } from "@/three/scene";

const SHEET_COUNT = 6;
const INK_CYCLE = [INK_COLORS.cyan, INK_COLORS.magenta, INK_COLORS.yellow, INK_COLORS.key];

function smootherstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export default function PaperStack({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const sheetRefs = useRef<(THREE.Group | null)[]>([]);
  const inkRefs = useRef<(THREE.Mesh | null)[]>([]);
  const clock = useRef(0.42);

  const paperMaterial = useMemo(() => createPaperMaterial(), []);
  const inkMaterials = useMemo(
    () => Array.from({ length: SHEET_COUNT }, (_, i) => createInkMaterial(INK_CYCLE[i % INK_CYCLE.length])),
    [],
  );

  useFrame((_, delta) => {
    // Slow, continuous showcase loop: stack -> separate -> ink reveals -> hold -> restack.
    if (!reducedMotion) {
      clock.current = (clock.current + delta * 0.085) % 1;
    }
    const t = clock.current;

    const separateT = smootherstep(0, 0.28, t) - smootherstep(0.72, 0.98, t);
    const inkT = smootherstep(0.26, 0.48, t) - smootherstep(0.68, 0.9, t);

    for (let i = 0; i < SHEET_COUNT; i++) {
      const sheet = sheetRefs.current[i];
      if (!sheet) continue;
      const spread = i - (SHEET_COUNT - 1) / 2;
      const stackedZ = -i * 0.018;
      const separatedZ = spread * 0.42;
      const separatedX = spread * 0.22;
      const separatedRotY = spread * 0.16;

      sheet.position.z = THREE.MathUtils.lerp(stackedZ, separatedZ, separateT);
      sheet.position.x = THREE.MathUtils.lerp(0, separatedX, separateT);
      sheet.rotation.y = THREE.MathUtils.lerp(0, separatedRotY, separateT);
      sheet.position.y = reducedMotion ? 0 : Math.sin(clock.current * Math.PI * 2 + i) * 0.03 * separateT;

      const ink = inkRefs.current[i];
      if (ink) {
        const mat = ink.material as THREE.MeshPhysicalMaterial;
        mat.opacity = THREE.MathUtils.clamp(inkT, 0, 1) * 0.78;
      }
    }

    if (groupRef.current) {
      const extraTilt = reducedMotion ? 0 : scrollSceneStore.heroScroll;
      groupRef.current.rotation.y = extraTilt * 0.55;
      groupRef.current.rotation.x = -extraTilt * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: SHEET_COUNT }).map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            sheetRefs.current[i] = el;
          }}
        >
          <mesh material={paperMaterial} castShadow receiveShadow>
            <boxGeometry args={[1.3, 1.78, 0.01]} />
          </mesh>
          <mesh
            ref={(el) => {
              inkRefs.current[i] = el;
            }}
            material={inkMaterials[i]}
            position={[0, 0, 0.008]}
          >
            <planeGeometry args={[1.1, 1.5]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
