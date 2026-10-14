import { Suspense, useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ContactShadows, Environment, Float } from "@react-three/drei";
import {
  Play,
  Pause,
  RotateCcw,
  Layers,
  Printer,
  Sparkles as SparklesIcon,
  Scissors,
  Package,
} from "lucide-react";

/* ─── Stage Definitions ─── */
const STAGES = [
  { id: 0, name: "Paper Feed",     icon: Layers,       color: "#38bdf8" },
  { id: 1, name: "Offset Print",   icon: Printer,      color: "#e11d48" },
  { id: 2, name: "Lamination",     icon: SparklesIcon,  color: "#f59e0b" },
  { id: 3, name: "Die-Cut",        icon: Scissors,     color: "#10b981" },
  { id: 4, name: "Finished",       icon: Package,      color: "#06b6d4" },
] as const;

/* ─── Easing Helpers ─── */
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const remap = (t: number, a: number, b: number) => smoothstep(clamp((t - a) / (b - a)));

/* ─── Metal Helper Component ─── */
function Metal({ color = "#2a303a", roughness = 0.22, metalness = 0.88 }: { color?: string; roughness?: number; metalness?: number }) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />;
}

/* ─── Spinning Roller ─── */
function Roller({ position, radius = 0.12, length = 2.4, speed = 8, color = "#444c58" }: {
  position: [number, number, number]; radius?: number; length?: number; speed?: number; color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.z += dt * speed; });
  return (
    <mesh ref={ref} position={position} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[radius, radius, length, 32]} />
      <Metal color={color} roughness={0.18} metalness={0.92} />
    </mesh>
  );
}

/* ─── Conveyor Belt Section ─── */
function ConveyorBelt({ x, z, width = 2.6 }: { x: number; z: number; width?: number }) {
  return (
    <group position={[x, -0.72, z]}>
      {/* Belt bed */}
      <mesh receiveShadow>
        <boxGeometry args={[width, 0.08, 1.6]} />
        <meshStandardMaterial color="#0f1218" roughness={0.65} metalness={0.4} />
      </mesh>
      {/* Guide rails */}
      {[-0.82, 0.82].map((rz) => (
        <mesh key={rz} position={[0, 0.06, rz]}>
          <boxGeometry args={[width, 0.06, 0.06]} />
          <Metal color="#3d4654" />
        </mesh>
      ))}
      {/* Belt rollers */}
      {Array.from({ length: Math.floor(width / 0.35) }).map((_, i) => (
        <Roller
          key={i}
          position={[-width / 2 + 0.2 + i * 0.35, -0.02, 0]}
          radius={0.035}
          length={1.5}
          speed={6}
          color="#5a6373"
        />
      ))}
    </group>
  );
}

/* ─── The Paper Sheet that Travels Through the Line ─── */
function TravelingSheet({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const printReveal = remap(progress, 0.18, 0.36);
  const laminationGloss = remap(progress, 0.40, 0.55);
  const dieCutPhase = remap(progress, 0.60, 0.72);

  useFrame(() => {
    if (!groupRef.current) return;
    // Move sheet along the production line (left to right: x = -5.5 → 5.5)
    const x = THREE.MathUtils.lerp(-5.5, 5.5, clamp(progress * 1.15 - 0.05));
    groupRef.current.position.x = x;
    groupRef.current.position.y = -0.56 + Math.sin(progress * Math.PI * 16) * 0.005;
    groupRef.current.visible = progress < 0.82;
  });

  return (
    <group ref={groupRef}>
      {/* Raw paperboard */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[1.8, 1.2]} />
        <meshStandardMaterial
          color="#faf8f3"
          roughness={0.8 - laminationGloss * 0.55}
          metalness={laminationGloss * 0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Printed content - fades in during printing stage */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[1.6, 1.0]} />
        <meshStandardMaterial
          color="#1e3a5f"
          roughness={0.5}
          transparent
          opacity={printReveal}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* CMYK color patches showing printing */}
      {[
        { color: "#00b4d8", x: -0.45, z: -0.2 },
        { color: "#e63946", x: -0.15, z: -0.2 },
        { color: "#f4d35e", x: 0.15, z: -0.2 },
        { color: "#1d1d2c", x: 0.45, z: -0.2 },
      ].map((patch, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[patch.x, 0.003, patch.z]}>
          <planeGeometry args={[0.22, 0.15]} />
          <meshStandardMaterial color={patch.color} transparent opacity={printReveal * 0.9} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Lamination sheen overlay */}
      {laminationGloss > 0 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <planeGeometry args={[1.78, 1.18]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={laminationGloss * 0.12}
            roughness={0.05}
            metalness={0.02}
            clearcoat={laminationGloss}
            clearcoatRoughness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      {/* Die-cut visual indicators */}
      {dieCutPhase > 0 && (
        <group>
          {[[-0.7, 0, -0.4], [0.7, 0, -0.4], [-0.7, 0, 0.4], [0.7, 0, 0.4]].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.06, 16]} />
              <meshStandardMaterial color="#090b11" transparent opacity={dieCutPhase * 0.85} side={THREE.DoubleSide} />
            </mesh>
          ))}
          {/* Score lines */}
          {[-0.3, 0, 0.3].map((z, i) => (
            <mesh key={`score-${i}`} position={[0, 0.004, z]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.6, 0.008]} />
              <meshStandardMaterial color="#b0b8c4" transparent opacity={dieCutPhase * 0.6} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

/* ─── Printing Station (CMYK Offset Press) ─── */
function PrintingStation() {
  const inkRollerRefs = useRef<(THREE.Mesh | null)[]>([]);
  const CMYK = ["#00b4d8", "#e63946", "#f4d35e", "#1d1d2c"];

  useFrame((_, dt) => {
    inkRollerRefs.current.forEach((r) => { if (r) r.rotation.z += dt * 10; });
  });

  return (
    <group position={[-2.4, 0, 0]}>
      {/* Press frame */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[2.8, 1.6, 2.0]} />
        <Metal color="#1a1f28" roughness={0.3} metalness={0.75} />
      </mesh>
      {/* Top plate */}
      <mesh position={[0, 0.92, 0]} castShadow>
        <boxGeometry args={[2.9, 0.06, 2.1]} />
        <Metal color="#2d3444" />
      </mesh>
      {/* 4 CMYK ink units */}
      {CMYK.map((color, i) => (
        <group key={i} position={[-1.0 + i * 0.68, 0.55, 0]}>
          {/* Ink reservoir */}
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.5, 0.28, 1.4]} />
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.35} />
          </mesh>
          {/* Impression cylinder */}
          <mesh
            ref={(el) => { inkRollerRefs.current[i] = el; }}
            position={[0, 0.08, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.16, 0.16, 1.3, 32]} />
            <meshStandardMaterial color={color} roughness={0.25} metalness={0.6} />
          </mesh>
          {/* Transfer roller */}
          <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 1.3, 24]} />
            <Metal color="#3a414e" roughness={0.15} metalness={0.95} />
          </mesh>
          {/* Status LED */}
          <mesh position={[0, 0.52, 0.72]}>
            <sphereGeometry args={[0.028, 12, 12]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
          </mesh>
        </group>
      ))}
      {/* Feed/exit rollers */}
      <Roller position={[-1.5, -0.38, 0]} radius={0.08} length={1.7} speed={7} color="#555e6e" />
      <Roller position={[1.5, -0.38, 0]} radius={0.08} length={1.7} speed={7} color="#555e6e" />
      {/* Control panel */}
      <group position={[1.2, 0.2, 1.1]} rotation={[-0.15, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.55, 0.42, 0.12]} />
          <Metal color="#1b2028" roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.02, 0.065]}>
          <planeGeometry args={[0.38, 0.22]} />
          <meshStandardMaterial color="#071520" emissive="#38bdf8" emissiveIntensity={0.5} roughness={0.15} />
        </mesh>
      </group>
      {/* PRINTING label */}
      <mesh position={[0, 0.96, 0.95]}>
        <boxGeometry args={[0.8, 0.04, 0.02]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

/* ─── Lamination Machine ─── */
function LaminationStation() {
  const topRollerRef = useRef<THREE.Mesh>(null);
  const botRollerRef = useRef<THREE.Mesh>(null);
  const filmRef = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    if (topRollerRef.current) topRollerRef.current.rotation.z -= dt * 9;
    if (botRollerRef.current) botRollerRef.current.rotation.z += dt * 9;
    if (filmRef.current) {
      // Film feed animation
      const uv = filmRef.current.material as THREE.MeshPhysicalMaterial;
      if (uv.userData.offset === undefined) uv.userData.offset = 0;
      uv.userData.offset += dt * 0.3;
    }
  });

  return (
    <group position={[0.2, 0, 0]}>
      {/* Machine housing */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[1.8, 1.4, 1.8]} />
        <Metal color="#1e242e" roughness={0.28} metalness={0.78} />
      </mesh>
      {/* Top plate */}
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[1.9, 0.05, 1.9]} />
        <Metal color="#2a3240" />
      </mesh>
      {/* Heat nip rollers (top & bottom) */}
      <mesh ref={topRollerRef} position={[0, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 1.5, 32]} />
        <meshStandardMaterial color="#c0c8d4" roughness={0.12} metalness={0.95} />
      </mesh>
      <mesh ref={botRollerRef} position={[0, -0.58, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 1.5, 32]} />
        <meshStandardMaterial color="#a8b0bc" roughness={0.12} metalness={0.95} />
      </mesh>
      {/* Film supply roll */}
      <mesh ref={filmRef} position={[0, 0.55, -0.5]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 1.2, 24]} />
        <meshPhysicalMaterial
          color="#e8edf5"
          transparent
          opacity={0.35}
          roughness={0.06}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>
      {/* Film trail between supply roll and nip rollers */}
      <mesh position={[0, 0.15, -0.25]} rotation={[-0.5, 0, 0]}>
        <planeGeometry args={[1.2, 0.7]} />
        <meshPhysicalMaterial
          color="#f0f4ff"
          transparent
          opacity={0.15}
          roughness={0.04}
          clearcoat={1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Heat indicator lights */}
      {[-0.5, 0, 0.5].map((z, i) => (
        <mesh key={i} position={[0.92, 0.4, z]}>
          <sphereGeometry args={[0.03, 10, 10]} />
          <meshStandardMaterial
            color={i === 0 ? "#ef4444" : "#f59e0b"}
            emissive={i === 0 ? "#ef4444" : "#f59e0b"}
            emissiveIntensity={1.2}
          />
        </mesh>
      ))}
      {/* LAMINATION label */}
      <mesh position={[0, 0.86, 0.88]}>
        <boxGeometry args={[0.7, 0.04, 0.02]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

/* ─── Die-Cutting / Punching Station ─── */
function DieCutStation({ progress }: { progress: number }) {
  const headRef = useRef<THREE.Group>(null);
  const punchPhase = remap(progress, 0.58, 0.73);

  useFrame(() => {
    if (!headRef.current) return;
    // Punching head strokes down and back up in a cycle
    const cycle = Math.sin(punchPhase * Math.PI * 6);
    headRef.current.position.y = 0.5 + Math.max(0, cycle) * 0.65;
  });

  return (
    <group position={[2.6, 0, 0]}>
      {/* Machine frame */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[1.6, 1.5, 1.8]} />
        <Metal color="#1c222c" roughness={0.3} metalness={0.76} />
      </mesh>
      {/* Top */}
      <mesh position={[0, 0.87, 0]}>
        <boxGeometry args={[1.7, 0.05, 1.9]} />
        <Metal color="#2c3442" />
      </mesh>
      {/* Hydraulic columns */}
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.0, 16]} />
          <meshStandardMaterial color="#6b7688" roughness={0.15} metalness={0.95} />
        </mesh>
      ))}
      {/* Punching head assembly */}
      <group ref={headRef}>
        {/* Head block */}
        <mesh castShadow>
          <boxGeometry args={[1.1, 0.18, 1.2]} />
          <Metal color="#3a4255" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Die rule (cutting edge) */}
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[0.95, 0.05, 1.05]} />
          <meshStandardMaterial color="#d4d8e0" roughness={0.08} metalness={0.98} />
        </mesh>
        {/* Punch pins */}
        {[[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].map(([px, pz], i) => (
          <mesh key={i} position={[px, -0.18, pz]}>
            <cylinderGeometry args={[0.04, 0.04, 0.12, 12]} />
            <meshStandardMaterial color="#c8cdd6" roughness={0.1} metalness={0.98} />
          </mesh>
        ))}
      </group>
      {/* Anvil / bed */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[1.2, 0.14, 1.3]} />
        <meshStandardMaterial color="#445060" roughness={0.25} metalness={0.85} />
      </mesh>
      {/* DIE-CUT label */}
      <mesh position={[0, 0.91, 0.88]}>
        <boxGeometry args={[0.5, 0.04, 0.02]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

/* ─── Finished Product Display ─── */
function FinishedProduct({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const showPhase = remap(progress, 0.78, 0.90);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.visible = showPhase > 0.01;
    groupRef.current.position.y = -0.2 + showPhase * 0.55;
    groupRef.current.rotation.y = showPhase * Math.PI * 1.5 + state.clock.elapsedTime * 0.3;
    groupRef.current.scale.setScalar(0.4 + showPhase * 0.6);
  });

  return (
    <group ref={groupRef} position={[4.8, 0, 0]}>
      {/* Finished printed sheet - folded into a box shape */}
      {/* Bottom */}
      <mesh position={[0, -0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.04, 0.55]} />
        <meshPhysicalMaterial color="#f0ebe2" roughness={0.35} clearcoat={0.8} clearcoatRoughness={0.1} />
      </mesh>
      {/* Front */}
      <mesh position={[0, 0, 0.275]} castShadow>
        <boxGeometry args={[0.8, 0.7, 0.04]} />
        <meshPhysicalMaterial color="#1e3a5f" roughness={0.3} clearcoat={0.9} clearcoatRoughness={0.08} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0, -0.275]} castShadow>
        <boxGeometry args={[0.8, 0.7, 0.04]} />
        <meshPhysicalMaterial color="#234875" roughness={0.3} clearcoat={0.9} clearcoatRoughness={0.08} />
      </mesh>
      {/* Left */}
      <mesh position={[-0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.04, 0.7, 0.55]} />
        <meshPhysicalMaterial color="#2a5080" roughness={0.3} clearcoat={0.9} clearcoatRoughness={0.08} />
      </mesh>
      {/* Right */}
      <mesh position={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.04, 0.7, 0.55]} />
        <meshPhysicalMaterial color="#2a5080" roughness={0.3} clearcoat={0.9} clearcoatRoughness={0.08} />
      </mesh>
      {/* Top flap */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.8, 0.04, 0.55]} />
        <meshPhysicalMaterial color="#e8e2d8" roughness={0.35} clearcoat={0.8} clearcoatRoughness={0.1} />
      </mesh>
      {/* CMYK swatches on front face */}
      {[
        { c: "#00b4d8", x: -0.22 },
        { c: "#e63946", x: -0.08 },
        { c: "#f4d35e", x: 0.06 },
        { c: "#1d1d2c", x: 0.20 },
      ].map(({ c, x }, i) => (
        <mesh key={i} position={[x, -0.18, 0.298]}>
          <planeGeometry args={[0.1, 0.06]} />
          <meshStandardMaterial color={c} />
        </mesh>
      ))}
      {/* PRINTIT logo placeholder */}
      <mesh position={[0, 0.08, 0.298]}>
        <planeGeometry args={[0.45, 0.12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── Output Tray ─── */
function OutputTray() {
  return (
    <group position={[4.8, -0.65, 0]}>
      {/* Tray base */}
      <mesh receiveShadow>
        <boxGeometry args={[1.4, 0.06, 1.4]} />
        <Metal color="#2a3040" roughness={0.3} />
      </mesh>
      {/* Tray walls */}
      {[
        [0, 0.15, -0.68] as [number, number, number],
        [0, 0.15, 0.68] as [number, number, number],
        [-0.68, 0.15, 0] as [number, number, number],
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={i < 2 ? [1.4, 0.3, 0.04] : [0.04, 0.3, 1.36]} />
          <Metal color="#333c4a" roughness={0.28} />
        </mesh>
      ))}
      {/* "FINISHED" label */}
      <mesh position={[0, 0.06, 0.72]}>
        <boxGeometry args={[0.5, 0.03, 0.02]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

/* ─── Paper Feeder Stack ─── */
function PaperStack() {
  return (
    <group position={[-5.2, -0.5, 0]}>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[0, i * 0.018, 0]} castShadow>
          <boxGeometry args={[1.6, 0.012, 1.1]} />
          <meshPhysicalMaterial color="#faf8f0" roughness={0.82} sheen={0.3} />
        </mesh>
      ))}
      {/* Stack tray */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <boxGeometry args={[1.7, 0.06, 1.2]} />
        <Metal color="#2e3642" roughness={0.3} />
      </mesh>
      {/* "FEED" label */}
      <mesh position={[0, 0.28, 0.58]}>
        <boxGeometry args={[0.4, 0.03, 0.02]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

/* ─── Ink Mist Particles ─── */
function InkParticles({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const dots = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      baseX: -3.4 + (i % 5) * 0.4,
      baseY: -0.1 + Math.random() * 0.6,
      baseZ: -0.5 + Math.random() * 1.0,
      speed: 1 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
      color: ["#00b4d8", "#e63946", "#f4d35e", "#38bdf8"][i % 4],
    })), []);

  const printingActive = remap(progress, 0.12, 0.40);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.visible = printingActive > 0.05;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const dot = dots[i];
      child.position.x = dot.baseX + Math.sin(t * dot.speed + dot.phase) * 0.08;
      child.position.y = dot.baseY + Math.sin(t * dot.speed * 0.7 + dot.phase) * 0.12;
      child.position.z = dot.baseZ + Math.cos(t * dot.speed * 0.5 + dot.phase) * 0.06;
      const s = 0.3 + Math.sin(t * dot.speed + dot.phase * 2) * 0.3;
      child.scale.setScalar(s * printingActive);
    });
  });

  return (
    <group ref={groupRef}>
      {dots.map((dot, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial
            color={dot.color}
            emissive={dot.color}
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Heat Waves from Laminator ─── */
function HeatWaves({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const active = remap(progress, 0.35, 0.55);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.visible = active > 0.05;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      child.position.y = 0.6 + Math.sin(t * 2 + i * 0.8) * 0.15;
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = active * (0.06 + Math.sin(t * 3 + i) * 0.03);
    });
  });

  return (
    <group ref={groupRef} position={[0.2, 0, 0]}>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[-0.4 + i * 0.2, 0.6, 0]}>
          <planeGeometry args={[0.3, 0.5]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Full Production Line Scene ─── */
function ProductionLineScene({ progress }: { progress: number }) {
  const sceneRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!sceneRef.current) return;
    // Gentle idle sway
    sceneRef.current.rotation.y = -0.15 + Math.sin(state.clock.elapsedTime * 0.15) * 0.04;
  });

  return (
    <group ref={sceneRef}>
      {/* Industrial floor platform */}
      <mesh position={[0, -0.82, 0]} receiveShadow>
        <boxGeometry args={[14, 0.12, 3.5]} />
        <meshStandardMaterial color="#0d1018" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Floor stripe */}
      <mesh position={[0, -0.755, 0]}>
        <boxGeometry args={[13.5, 0.005, 3.2]} />
        <meshStandardMaterial color="#161c26" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Paper feeder stack */}
      <PaperStack />

      {/* Conveyor sections connecting machines */}
      <ConveyorBelt x={-4.0} z={0} width={2.0} />
      <ConveyorBelt x={-1.0} z={0} width={2.0} />
      <ConveyorBelt x={1.5} z={0} width={1.8} />
      <ConveyorBelt x={3.8} z={0} width={1.8} />

      {/* Production Machines */}
      <PrintingStation />
      <LaminationStation />
      <DieCutStation progress={progress} />

      {/* Output tray */}
      <OutputTray />

      {/* The traveling sheet */}
      <TravelingSheet progress={progress} />

      {/* Finished product reveal */}
      <FinishedProduct progress={progress} />

      {/* Effects */}
      <InkParticles progress={progress} />
      <HeatWaves progress={progress} />

      {/* Contact shadows */}
      <ContactShadows position={[0, -0.76, 0]} opacity={0.6} blur={2.5} far={5} scale={15} />
    </group>
  );
}

/* ═══════════════════════════════════════════════
   MAIN EXPORTED COMPONENT
   ═══════════════════════════════════════════════ */

export default function PrintingProcessAnimation() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const animRef = useRef<number | null>(null);

  const DURATION_MS = 14000; // 14 seconds full cycle

  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (isPlaying) {
        setProgress((prev) => {
          if (!Number.isFinite(delta) || delta < 0) return prev;
          const safeDelta = Math.min(delta, 200);
          const step = (safeDelta / DURATION_MS) * playbackSpeed;
          const next = (Number.isFinite(prev) ? prev : 0) + step;
          return next >= 1 ? 0 : next;
        });
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isPlaying, playbackSpeed]);

  const safeProgress = Number.isFinite(progress) ? clamp(progress, 0, 0.9999) : 0;
  const stageIndex = Math.max(0, Math.min(4, Math.floor(safeProgress * 5)));
  const activeStage = STAGES[stageIndex] ?? STAGES[0];
  const timeCode = (safeProgress * 14).toFixed(1);

  return (
    <div className="relative flex flex-col rounded-3xl border border-white/15 bg-gradient-to-b from-[#111420] via-[#0c0e16] to-[#090b11] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)] overflow-hidden">
      {/* ── Header Bar ── */}
      <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-5 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Production Line:{" "}
            <span className="text-cyan">{activeStage.name}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-mono text-white/70">
            <span>{timeCode}s</span> / <span>14.0s</span>
          </div>
          <button
            type="button"
            onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))}
            className="rounded-md border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white/80 hover:bg-white/15 transition"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>

      {/* ── 3D Canvas ── */}
      <div className="relative aspect-[21/10] sm:aspect-[21/9] w-full min-h-[320px] bg-gradient-to-b from-[#0e1220]/60 to-transparent">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 2.8, 8.5], fov: 36 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.55} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={2.5}
            castShadow
            color="#ffffff"
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-5, 3, 3]} intensity={1.2} color="#38bdf8" />
          <pointLight position={[4, 2, -3]} intensity={0.8} color="#f59e0b" />
          <pointLight position={[0, 4, 0]} intensity={0.6} color="#e2e8f0" />
          <Environment preset="city" environmentIntensity={0.5} />

          <Suspense fallback={null}>
            <ProductionLineScene progress={safeProgress} />
          </Suspense>
        </Canvas>

        {/* Stage info overlay */}
        <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex flex-col gap-1 rounded-2xl border border-white/15 bg-black/70 p-3 backdrop-blur-xl shadow-lg max-w-[240px]">
          <div className="flex items-center gap-2">
            <activeStage.icon className="h-4 w-4" style={{ color: activeStage.color }} />
            <strong className="text-xs font-bold text-white">{activeStage.name}</strong>
          </div>
          <p className="text-[10px] leading-relaxed text-white/60">
            {stageIndex === 0 && "Sheet feeding into offset press line"}
            {stageIndex === 1 && "CMYK ink transfer onto paperboard"}
            {stageIndex === 2 && "Thermal protective film lamination"}
            {stageIndex === 3 && "Precision die-cutting & hole punching"}
            {stageIndex === 4 && "Finished product ready for delivery"}
          </p>
        </div>
      </div>

      {/* ── Timeline Scrubber ── */}
      <div className="border-t border-white/10 bg-[#090b11] p-4 sm:p-5">
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setProgress(clamp((e.clientX - rect.left) / rect.width));
          }}
          className="relative h-2 w-full cursor-pointer rounded-full bg-white/10 overflow-hidden"
          title="Click to seek"
        >
          {/* Stage color segments */}
          <div className="absolute inset-0 flex">
            {STAGES.map((s) => (
              <div key={s.id} className="flex-1 opacity-20" style={{ background: s.color }} />
            ))}
          </div>
          <div
            className="relative h-full bg-gradient-to-r from-cyan via-rose-500 to-amber-400 transition-[width] duration-75"
            style={{ width: `${safeProgress * 100}%` }}
          />
        </div>

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
          {/* Transport controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 rounded-full bg-cyan px-3.5 py-1.5 text-xs font-bold text-ink shadow-md hover:bg-cyan/90 transition active:scale-95"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              onClick={() => { setProgress(0); setIsPlaying(true); }}
              title="Restart"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/15 active:scale-95 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Stage navigation pills */}
          <div className="flex flex-wrap gap-1.5">
            {STAGES.map((st, idx) => {
              const isActive = idx === stageIndex;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setProgress(clamp(idx / 5 + 0.01))}
                  className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all ${
                    isActive
                      ? "border border-cyan bg-cyan/20 text-cyan shadow-[0_0_12px_rgba(56,189,248,0.3)] scale-105"
                      : "border border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white"
                  }`}
                >
                  <st.icon className="h-3 w-3" style={{ color: isActive ? st.color : "inherit" }} />
                  <span className="hidden md:inline">{st.name}</span>
                  <span className="md:hidden">0{idx + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
