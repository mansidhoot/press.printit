import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { BRAND, INK_COLORS, scrollSceneStore } from "@/three/scene";
import { createPaperMaterial } from "@/three/materials";
import logo from "@/assets/logo-clean.png";

const clamp01 = (v: number) => THREE.MathUtils.clamp(v, 0, 1);
const smooth = (v: number) => v * v * (3 - 2 * v);
const stage = (p: number, a: number, b: number) => smooth(clamp01((p - a) / (b - a)));

function Metal({ color = "#252a31", roughness = 0.24, metalness = 0.82 }: { color?: string; roughness?: number; metalness?: number }) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />;
}

function Roller({ x, y, z = 0, scale = 1, ink = false }: { x: number; y: number; z?: number; scale?: number; ink?: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const scrollRot = -scrollSceneStore.heroScroll * Math.PI * (ink ? 15 : 11);
      const idleRot = -state.clock.getElapsedTime() * (ink ? 2.5 : 1.8);
      ref.current.rotation.z = scrollRot + idleRot;
    }
  });
  return (
    <group position={[x, y, z]}>
      <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.115 * scale, 0.115 * scale, 1.62 * scale, 40]} />
        <Metal color={ink ? "#343a44" : "#11151a"} roughness={ink ? 0.2 : 0.18} metalness={0.9} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.15 * scale, 0.15 * scale, 1.72 * scale, 40, 1, true]} />
        <meshStandardMaterial color="#59616b" metalness={0.92} roughness={0.14} transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function Gear({ x, y, z = 0, scale = 1, reverse = false }: { x: number; y: number; z?: number; scale?: number; reverse?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const dir = reverse ? -1 : 1;
      const scrollRot = dir * scrollSceneStore.heroScroll * Math.PI * 10;
      const idleRot = dir * state.clock.getElapsedTime() * 1.5;
      ref.current.rotation.z = scrollRot + idleRot;
    }
  });
  return (
    <group ref={ref} position={[x, y, z]}>
      <mesh castShadow>
        <torusGeometry args={[0.18 * scale, 0.055 * scale, 10, 24]} />
        <Metal color="#414850" roughness={0.2} metalness={0.95} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.06 * scale, 0.06 * scale, 0.035 * scale, 18]} />
        <Metal color="#171b20" roughness={0.22} metalness={0.9} />
      </mesh>
    </group>
  );
}

function LightBar({ position, color }: { position: [number, number, number]; color: THREE.Color }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      const pulse = 0.55 + Math.sin(performance.now() * 0.006 + position[0]) * 0.25;
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.72, 0.025, 0.025]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} toneMapped={false} />
    </mesh>
  );
}

function InkParticles({ color, offset, progress }: { color: THREE.Color; offset: number; progress: number }) {
  const group = useRef<THREE.Group>(null);
  const dots = useMemo(() => Array.from({ length: 7 }, (_, i) => i), []);
  useFrame(() => {
    if (!group.current) return;
    group.current.visible = progress > 0;
    group.current.children.forEach((child, i) => {
      const t = (progress * 5 + i * 0.17 + offset) % 1;
      child.position.y = 0.18 + t * 0.42;
      child.position.x = -0.24 + Math.sin(t * 8 + i) * 0.07;
      child.position.z = 0.28 + Math.cos(t * 7 + i) * 0.04;
      child.scale.setScalar(0.45 + Math.sin(t * Math.PI) * 0.55);
    });
  });
  return (
    <group ref={group} position={[0, 0, 0]}>
      {dots.map((i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.014, 10, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.62} />
        </mesh>
      ))}
    </group>
  );
}

function PrintingUnit({ x, color, index, progress }: { x: number; color: THREE.Color; index: number; progress: number }) {
  const cylinder = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (cylinder.current) {
      const scrollRot = scrollSceneStore.heroScroll * Math.PI * (13 + index);
      const idleRot = state.clock.getElapsedTime() * (2.2 + index * 0.2);
      cylinder.current.rotation.z = scrollRot + idleRot;
    }
  });
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, -0.1, -0.04]} castShadow>
        <boxGeometry args={[0.88, 1.12, 1.18]} />
        <Metal color="#20252c" roughness={0.25} metalness={0.78} />
      </mesh>
      <mesh position={[0, 0.57, 0]}>
        <boxGeometry args={[0.82, 0.045, 1.05]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.28} roughness={0.32} metalness={0.45} />
      </mesh>
      <mesh ref={cylinder} position={[0, 0.46, 0.24]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.0, 48]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.16, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 1.03, 36]} />
        <meshStandardMaterial color="#171a1f" roughness={0.23} metalness={0.9} />
      </mesh>
      <LightBar position={[0, 0.18, 0.61]} color={color} />
      <InkParticles color={color} offset={index * 0.2} progress={stage(progress, 0.25 + index * 0.08, 0.52 + index * 0.08)} />
    </group>
  );
}

function PaperSheet({ position, rotation = 0, logoTexture, opacity = 1, scale = 1 }: { position: [number, number, number]; rotation?: number; logoTexture: THREE.Texture; opacity?: number; scale?: number }) {
  return (
    <group position={position} rotation={[0, 0, rotation]} scale={scale}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.28, 0.88, 0.045]} />
        <meshPhysicalMaterial color="#faf8f1" roughness={0.76} sheen={0.55} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0, 0.028]}>
        <planeGeometry args={[0.84, 0.36]} />
        <meshBasicMaterial map={logoTexture} transparent opacity={opacity} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function PrintingPress({ reducedMotion }: { reducedMotion: boolean }) {
  const logoTexture = useLoader(TextureLoader, logo);
  const group = useRef<THREE.Group>(null);
  const paper = useRef<THREE.Group>(null);
  const logoPlane = useRef<THREE.Mesh>(null);
  const finished = useRef<THREE.Group>(null);
  const paperMaterial = useMemo(() => createPaperMaterial(new THREE.Color("#fbfaf6")), []);

  useFrame((state) => {
    const idleCycle = (state.clock.getElapsedTime() * 0.12) % 1;
    const p = reducedMotion ? 0.92 : (scrollSceneStore.heroScroll > 0.02 ? scrollSceneStore.heroScroll : idleCycle);
    const machineEntrance = stage(p, 0.03, 0.2);
    const printProgress = stage(p, 0.24, 0.66);
    const exitProgress = stage(p, 0.64, 0.92);
    const paperProgress = stage(p, 0.04, 0.94);

    const x = THREE.MathUtils.lerp(-3.05, 3.05, paperProgress);
    if (paper.current) {
      paper.current.position.x = x;
      paper.current.position.y = 0.24 + Math.sin(p * Math.PI * 10) * 0.018;
      paper.current.rotation.z = Math.sin(p * Math.PI * 7) * 0.014;
      paper.current.rotation.y = Math.sin(p * Math.PI * 4) * 0.018;
    }
    if (logoPlane.current) {
      const reveal = stage(p, 0.40, 0.66);
      logoPlane.current.scale.setScalar(0.72 + reveal * 0.28);
      (logoPlane.current.material as THREE.MeshBasicMaterial).opacity = reveal;
    }
    if (finished.current) {
      finished.current.position.y = 0.03 + exitProgress * 0.7;
      finished.current.rotation.z = exitProgress * -0.08;
      finished.current.scale.setScalar(0.75 + exitProgress * 0.25);
    }
    if (group.current) {
      group.current.rotation.y = reducedMotion ? -0.08 : THREE.MathUtils.lerp(-0.14, 0.1, p);
      group.current.position.y = machineEntrance * 0.035 - exitProgress * 0.02;
    }

    void printProgress;
  });

  return (
    <group ref={group}>
      {/* Premium factory platform */}
      <mesh position={[0, -1.02, -0.62]} receiveShadow>
        <boxGeometry args={[7.25, 0.18, 2.55]} />
        <meshStandardMaterial color="#0e1116" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.9, -0.62]}>
        <boxGeometry args={[7.0, 0.04, 2.32]} />
        <meshStandardMaterial color="#2c323a" roughness={0.48} metalness={0.62} />
      </mesh>

      {/* Main press chassis */}
      <mesh position={[0, -0.35, -0.28]} castShadow receiveShadow>
        <boxGeometry args={[6.35, 2.25, 1.55]} />
        <Metal color="#15191f" roughness={0.26} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.74, -0.28]} castShadow>
        <boxGeometry args={[6.08, 0.17, 1.43]} />
        <Metal color="#3a414b" roughness={0.2} metalness={0.88} />
      </mesh>

      {/* Glass inspection canopy */}
      <mesh position={[0, 0.72, 0.25]}>
        <boxGeometry args={[4.65, 0.92, 0.045]} />
        <meshPhysicalMaterial color="#aeefff" transmission={0.72} thickness={0.04} roughness={0.08} transparent opacity={0.16} metalness={0.05} />
      </mesh>

      {/* Four CMYK printing stations */}
      {[
        [-1.65, INK_COLORS.cyan],
        [-0.55, INK_COLORS.magenta],
        [0.55, INK_COLORS.yellow],
        [1.65, INK_COLORS.key],
      ].map(([x, color], i) => (
        <PrintingUnit key={i} x={x as number} color={color as THREE.Color} index={i} progress={scrollSceneStore.heroScroll} />
      ))}

      {/* Feed / transfer rollers */}
      <Roller x={-2.82} y={0.12} scale={1.08} />
      <Roller x={-2.43} y={0.12} scale={0.76} />
      <Roller x={-1.98} y={0.12} scale={0.62} ink />
      <Roller x={1.98} y={0.12} scale={0.62} ink />
      <Roller x={2.43} y={0.12} scale={0.76} />
      <Roller x={2.82} y={0.12} scale={1.08} />

      {/* Mechanical drive system */}
      <Gear x={-2.42} y={-0.79} scale={1.05} />
      <Gear x={-2.03} y={-0.79} scale={0.7} reverse />
      <Gear x={2.08} y={-0.79} scale={0.95} reverse />
      <Gear x={2.53} y={-0.79} scale={0.62} />
      <mesh position={[-2.22, -0.79, -0.02]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.82, 16]} />
        <Metal color="#737c86" roughness={0.18} metalness={0.95} />
      </mesh>
      <mesh position={[2.3, -0.79, -0.02]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.82, 16]} />
        <Metal color="#737c86" roughness={0.18} metalness={0.95} />
      </mesh>

      {/* Paper feeder stack */}
      <group position={[-3.05, -0.52, 0.08]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[0, i * 0.025, 0]} castShadow>
            <boxGeometry args={[1.18, 0.018, 0.82]} />
            <meshPhysicalMaterial color="#f7f4ec" roughness={0.8} sheen={0.45} />
          </mesh>
        ))}
        <mesh position={[0, -0.05, -0.48]} rotation={[0.06, 0, 0]}>
          <boxGeometry args={[1.42, 0.06, 0.12]} />
          <Metal color="#4b535e" roughness={0.3} metalness={0.82} />
        </mesh>
      </group>

      {/* Paper moving through the machine */}
      <group ref={paper} position={[-3.05, 0.24, 0.18]}>
        <mesh material={paperMaterial} castShadow receiveShadow>
          <boxGeometry args={[1.28, 0.88, 0.055]} />
        </mesh>
        <mesh ref={logoPlane} position={[0, 0, 0.033]}>
          <planeGeometry args={[0.84, 0.36]} />
          <meshBasicMaterial map={logoTexture} transparent opacity={0} toneMapped={false} />
        </mesh>
      </group>

      {/* Motion sheets behind the hero sheet create the "video" feeling */}
      <PaperSheet position={[-2.58, -0.08, -0.18]} rotation={-0.02} logoTexture={logoTexture} opacity={0.34} scale={0.94} />
      <PaperSheet position={[-2.12, -0.02, -0.2]} rotation={0.015} logoTexture={logoTexture} opacity={0.2} scale={0.88} />

      {/* Output tray + finished printed sheet */}
      <mesh position={[3.0, -0.12, 0.08]} rotation={[0, 0, 0.16]} castShadow>
        <boxGeometry args={[1.28, 0.07, 1.02]} />
        <Metal color="#464e58" roughness={0.28} metalness={0.78} />
      </mesh>
      <group ref={finished} position={[3.05, 0.03, 0.2]}>
        <mesh castShadow>
          <boxGeometry args={[1.18, 0.8, 0.04]} />
          <meshPhysicalMaterial color="#faf8f1" roughness={0.72} sheen={0.58} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[0.8, 0.34]} />
          <meshBasicMaterial map={logoTexture} toneMapped={false} />
        </mesh>
      </group>

      {/* Control console */}
      <group position={[2.55, 0.2, 0.66]} rotation={[-0.12, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.68, 0.5, 0.18]} />
          <Metal color="#20252b" roughness={0.25} metalness={0.78} />
        </mesh>
        <mesh position={[0, 0.02, 0.101]}>
          <planeGeometry args={[0.45, 0.25]} />
          <meshStandardMaterial color="#071014" emissive="#4fb8e0" emissiveIntensity={0.55} roughness={0.18} metalness={0.25} />
        </mesh>
        {[-0.22, 0, 0.22].map((x, i) => (
          <mesh key={i} position={[x, -0.17, 0.11]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color={i === 0 ? "#42d6a3" : i === 1 ? "#f0cf5a" : "#d94c78"} emissive={i === 0 ? "#42d6a3" : i === 1 ? "#f0cf5a" : "#d94c78"} emissiveIntensity={0.8} />
          </mesh>
        ))}
      </group>

      {/* Structural columns and status lighting */}
      {[-2.75, 2.75].map((x) => (
        <group key={x} position={[x, 0.18, -0.74]}>
          <mesh castShadow>
            <boxGeometry args={[0.18, 1.95, 0.2]} />
            <Metal color="#303741" roughness={0.22} metalness={0.88} />
          </mesh>
          <mesh position={[0, 0.78, 0.11]}>
            <boxGeometry args={[0.07, 0.36, 0.025]} />
            <meshStandardMaterial color="#4fb8e0" emissive="#4fb8e0" emissiveIntensity={0.75} />
          </mesh>
        </group>
      ))}

      {/* Floating ink / dust atmosphere around the press */}
      <mesh position={[0, 0.95, 0.4]}>
        <sphereGeometry args={[0.9, 24, 24]} />
        <meshBasicMaterial color="#4fb8e0" transparent opacity={0.018} depthWrite={false} />
      </mesh>
    </group>
  );
}
