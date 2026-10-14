import { Suspense, useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { ContactShadows, Environment, Sparkles } from "@react-three/drei";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles as SparklesIcon,
  CheckCircle2,
  Printer,
  Layers,
  Scissors,
  Package,
  Boxes,
  ShieldCheck,
  ChevronRight,
  Maximize2,
} from "lucide-react";

import pharmaSheetPrint from "@/assets/pharma-sheet-print.png";
import pharmaBoxFront from "@/assets/pharma-box-front.png";
import pharmaBoxSide from "@/assets/pharma-box-side.png";

// Stages of the pharmaceutical carton manufacturing line
export const PHARMA_STAGES = [
  {
    id: 0,
    name: "01 Sheet Feed",
    title: "Virgin Medical Board Feeding",
    desc: "350 GSM virgin SBS food & pharma grade paperboard loaded with high-speed vacuum suction & guide-pin registration.",
    icon: Layers,
    color: "#38bdf8",
  },
  {
    id: 1,
    name: "02 Offset Print",
    title: "High-Precision 6-Color Printing",
    desc: "UV offset printing transfers Rx branding, composition, Schedule H warning box, barcodes and batch details with micron accuracy.",
    icon: Printer,
    color: "#e11d48",
  },
  {
    id: 2,
    name: "03 Lamination",
    title: "Barrier Gloss/Matte Lamination",
    desc: "Thermal barrier film applied across the sheet to protect against moisture, handling abrasion, and transit wear.",
    icon: SparklesIcon,
    color: "#f59e0b",
  },
  {
    id: 3,
    name: "04 Die-Punch",
    title: "Precision Die-Cutting & Creasing",
    desc: "Laser-cut steel rule dies punch out tuck-in flaps, dieline outline, and score creases for flawless machine folding.",
    icon: Scissors,
    color: "#10b981",
  },
  {
    id: 4,
    name: "05 Pasting & Fold",
    title: "Folder-Gluer Side-Seam Pasting",
    desc: "Automated glue nozzles dispense adhesive on side tabs while motorized belts fold the 4 panels into a ready carton sleeve.",
    icon: Boxes,
    color: "#6366f1",
  },
  {
    id: 5,
    name: "06 Finished 3D Box",
    title: "Completed Pharma Mono Carton",
    desc: "Fully formed medical box with tamper-evident seal, blister slot, and batch stamp ready for pharmaceutical packaging lines.",
    icon: Package,
    color: "#06b6d4",
  },
];

interface ProductionSceneProps {
  progress: number; // 0 to 1
  stage: number;
}

function ProductionScene({ progress, stage }: ProductionSceneProps) {
  // Load textures
  const sheetTexture = useLoader(TextureLoader, pharmaSheetPrint);
  const frontTexture = useLoader(TextureLoader, pharmaBoxFront);
  const sideTexture = useLoader(TextureLoader, pharmaBoxSide);

  const sceneGroup = useRef<THREE.Group>(null);
  const printRollerRef = useRef<THREE.Mesh>(null);
  const laminationRollerRef = useRef<THREE.Mesh>(null);
  const dieHeadRef = useRef<THREE.Group>(null);
  const finishedBoxRef = useRef<THREE.Group>(null);
  const sheetGroupRef = useRef<THREE.Group>(null);

  // Materials
  const rawBoardMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f1f5f9",
        roughness: 0.85,
        metalness: 0.05,
      }),
    []
  );

  const conveyorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#181e28",
        roughness: 0.35,
        metalness: 0.75,
      }),
    []
  );

  const metalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#334155",
        roughness: 0.2,
        metalness: 0.9,
      }),
    []
  );

  const chromeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#94a3b8",
        roughness: 0.1,
        metalness: 0.95,
      }),
    []
  );

  useFrame((_, delta) => {
    // 1. Stage 0: Sheet Feed (progress 0..0.16)
    if (sheetGroupRef.current) {
      if (progress < 0.16) {
        const feedT = progress / 0.16;
        sheetGroupRef.current.position.z = THREE.MathUtils.lerp(3.5, 0, feedT);
        sheetGroupRef.current.position.y = -0.3;
        sheetGroupRef.current.visible = true;
      } else if (progress < 0.72) {
        sheetGroupRef.current.position.z = 0;
        sheetGroupRef.current.position.y = -0.3;
        sheetGroupRef.current.visible = true;
      } else {
        // Disappear when box takes over
        sheetGroupRef.current.visible = false;
      }
    }

    // 2. Stage 1: Offset Printing (progress 0.16..0.33)
    if (printRollerRef.current) {
      if (progress >= 0.14 && progress <= 0.36) {
        printRollerRef.current.visible = true;
        const rollerT = (progress - 0.16) / 0.17;
        printRollerRef.current.position.z = THREE.MathUtils.lerp(-1.8, 1.8, THREE.MathUtils.clamp(rollerT, 0, 1));
        printRollerRef.current.rotation.x += delta * 12;
      } else {
        printRollerRef.current.visible = false;
      }
    }

    // 3. Stage 2: Lamination (progress 0.33..0.50)
    if (laminationRollerRef.current) {
      if (progress >= 0.31 && progress <= 0.52) {
        laminationRollerRef.current.visible = true;
        const lamT = (progress - 0.33) / 0.17;
        laminationRollerRef.current.position.z = THREE.MathUtils.lerp(-1.8, 1.8, THREE.MathUtils.clamp(lamT, 0, 1));
        laminationRollerRef.current.rotation.x += delta * 14;
      } else {
        laminationRollerRef.current.visible = false;
      }
    }

    // 4. Stage 3: Die-Punching (progress 0.50..0.66)
    if (dieHeadRef.current) {
      if (progress >= 0.48 && progress <= 0.68) {
        dieHeadRef.current.visible = true;
        const punchT = (progress - 0.5) / 0.16;
        // Punch stroke down then up twice
        const punchCycle = Math.sin(punchT * Math.PI * 4);
        dieHeadRef.current.position.y = THREE.MathUtils.lerp(1.6, 0.15, Math.max(0, punchCycle));
      } else {
        dieHeadRef.current.visible = false;
      }
    }

    // 5 & 6. Stage 4 & 5: Pasting & Completed 3D Medical Box (progress 0.66..1.0)
    if (finishedBoxRef.current) {
      if (progress >= 0.66) {
        finishedBoxRef.current.visible = true;
        const boxT = (progress - 0.66) / 0.34;

        if (boxT < 0.35) {
          // Assembling & folding upwards
          const foldProgress = boxT / 0.35;
          finishedBoxRef.current.scale.setScalar(THREE.MathUtils.lerp(0.4, 1, foldProgress));
          finishedBoxRef.current.position.y = THREE.MathUtils.lerp(-0.2, 0.4, foldProgress);
          finishedBoxRef.current.rotation.y = foldProgress * Math.PI * 0.5;
        } else {
          // Fully formed box rotating in spotlight 360°
          const showcaseT = (boxT - 0.35) / 0.65;
          finishedBoxRef.current.scale.setScalar(1);
          finishedBoxRef.current.position.y = 0.4 + Math.sin(showcaseT * Math.PI * 2) * 0.08;
          finishedBoxRef.current.rotation.y = THREE.MathUtils.lerp(0.5, 0.5 + Math.PI * 2, showcaseT);
          finishedBoxRef.current.rotation.x = Math.sin(showcaseT * Math.PI * 2) * 0.1;
        }
      } else {
        finishedBoxRef.current.visible = false;
      }
    }
  });

  // Calculate printed texture reveal opacity
  const printReveal = progress < 0.16 ? 0 : progress < 0.33 ? (progress - 0.16) / 0.17 : 1;
  const laminationGloss = progress >= 0.33 ? 0.9 : 0.2;
  const laminationClearcoat = progress >= 0.33 ? 1 : 0;

  return (
    <group ref={sceneGroup}>
      {/* Heavy industrial machine base / conveyor bed */}
      <mesh position={[0, -0.65, 0]} material={conveyorMat} receiveShadow>
        <boxGeometry args={[4.8, 0.4, 4.8]} />
      </mesh>

      {/* Conveyor guide rails */}
      {[-2.2, 2.2].map((x) => (
        <mesh key={x} position={[x, -0.38, 0]} material={metalMat}>
          <boxGeometry args={[0.18, 0.22, 4.6]} />
        </mesh>
      ))}

      {/* Conveyor rollers on the bed */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[0, -0.42, -2.0 + i * 0.5]} rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
          <cylinderGeometry args={[0.06, 0.06, 4.2, 20]} />
        </mesh>
      ))}

      {/* SHEET GROUP (Stages 0 to 4) */}
      <group ref={sheetGroupRef} position={[0, -0.3, 0]}>
        {/* Base raw paperboard */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} castShadow receiveShadow>
          <planeGeometry args={[3.2, 3.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.8} />
        </mesh>

        {/* Printed Artwork Layer (revealed during Stage 1) */}
        {printReveal > 0 && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
            <planeGeometry args={[3.18, 3.18]} />
            <meshPhysicalMaterial
              map={sheetTexture}
              transparent
              opacity={Math.min(1, printReveal)}
              roughness={1 - laminationGloss * 0.8}
              metalness={0.1}
              clearcoat={laminationClearcoat}
              clearcoatRoughness={0.08}
            />
          </mesh>
        )}

        {/* Die-Cut Outline Flash (Stage 3) */}
        {stage === 3 && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <planeGeometry args={[2.8, 2.8]} />
            <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.65} />
          </mesh>
        )}
      </group>

      {/* PRINTING CYLINDER (Stage 1) */}
      <mesh ref={printRollerRef} position={[0, 0.25, 0]} rotation={[0, 0, Math.PI / 2]} material={chromeMat} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 3.4, 32]} />
      </mesh>

      {/* LAMINATION HEATER ROLLER (Stage 2) */}
      <mesh
        ref={laminationRollerRef}
        position={[0, 0.25, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={new THREE.MeshStandardMaterial({ color: "#f59e0b", metalness: 0.9, roughness: 0.15 })}
        castShadow
      >
        <cylinderGeometry args={[0.26, 0.26, 3.4, 32]} />
      </mesh>

      {/* DIE-PUNCH STAMP HEAD (Stage 3) */}
      <group ref={dieHeadRef} position={[0, 1.4, 0]}>
        {/* Upper punch block */}
        <mesh material={metalMat} castShadow>
          <boxGeometry args={[3.2, 0.45, 3.2]} />
        </mesh>
        {/* Steel cutting blades */}
        <mesh position={[0, -0.28, 0]} material={new THREE.MeshStandardMaterial({ color: "#e2e8f0", metalness: 0.98, roughness: 0.08 })}>
          <boxGeometry args={[2.9, 0.12, 2.9]} />
        </mesh>
        {/* 4 Corner hydraulic pistons */}
        {[
          [-1.4, -1.4],
          [1.4, -1.4],
          [-1.4, 1.4],
          [1.4, 1.4],
        ].map(([px, pz], idx) => (
          <mesh key={idx} position={[px, 0.5, pz]} material={chromeMat}>
            <cylinderGeometry args={[0.08, 0.08, 1.2, 16]} />
          </mesh>
        ))}
      </group>

      {/* FINAL ASSEMBLED 3D PHARMA BOX (Stage 5 & 6) */}
      <group ref={finishedBoxRef} position={[0, 0.4, 0]}>
        {/* 3D Medical Box Main Chassis */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.0, 3.1, 1.25]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.2} metalness={0.05} clearcoat={1} clearcoatRoughness={0.08} />
        </mesh>

        {/* Front Face with Pharma Branding */}
        <mesh position={[0, 0, 0.63]}>
          <planeGeometry args={[1.96, 3.06]} />
          <meshPhysicalMaterial map={frontTexture} roughness={0.18} clearcoat={1} clearcoatRoughness={0.06} />
        </mesh>

        {/* Back Face */}
        <mesh position={[0, 0, -0.63]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.96, 3.06]} />
          <meshPhysicalMaterial map={frontTexture} roughness={0.18} clearcoat={1} clearcoatRoughness={0.06} />
        </mesh>

        {/* Right Side (Batch & Composition) */}
        <mesh position={[1.01, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.22, 3.06]} />
          <meshPhysicalMaterial map={sideTexture} roughness={0.25} />
        </mesh>

        {/* Left Side */}
        <mesh position={[-1.01, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.22, 3.06]} />
          <meshPhysicalMaterial map={sideTexture} roughness={0.25} />
        </mesh>

        {/* Top Tuck Flap with Seal */}
        <mesh position={[0, 1.56, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.96, 1.22]} />
          <meshStandardMaterial color="#0e7490" roughness={0.2} metalness={0.3} />
        </mesh>

        {/* Hologram Tamper Seal Stamp */}
        <mesh position={[0, 1.565, 0.52]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.7, 0.35]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
            iridescence={1}
            iridescenceIOR={1.6}
          />
        </mesh>

        {/* Realistic Blister Pack Leaning against the Box */}
        <group position={[1.4, -0.7, 0.4]} rotation={[0.1, -0.4, 0.2]}>
          <mesh castShadow>
            <boxGeometry args={[1.6, 2.2, 0.03]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.15} />
          </mesh>
          {/* 10 Capsule Blister Bubbles */}
          {Array.from({ length: 10 }).map((_, bi) => {
            const bx = -0.5 + (bi % 2) * 1.0;
            const by = 0.8 - Math.floor(bi / 2) * 0.4;
            return (
              <mesh key={bi} position={[bx, by, 0.04]} castShadow>
                <capsuleGeometry args={[0.12, 0.22, 8, 16]} />
                <meshStandardMaterial color="#0284c7" metalness={0.3} roughness={0.2} />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* Sparkles during Lamination & Die-Punch */}
      <Sparkles count={stage === 3 ? 45 : 18} scale={[4, 3, 4]} size={stage === 3 ? 3.5 : 1.8} speed={0.5} color="#38bdf8" opacity={0.6} />

      {/* Soft Contact Shadow beneath conveyor */}
      <ContactShadows position={[0, -0.86, 0]} opacity={0.7} scale={7} blur={2.5} far={4} />
    </group>
  );
}

export default function PharmaManufacturing3D() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const animFrameRef = useRef<number | null>(null);

  // Total duration of full sequence: 16 seconds at 1x speed
  const DURATION_MS = 16000;

  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (isPlaying) {
        setProgress((prev) => {
          if (!Number.isFinite(delta) || delta < 0) return prev;
          const safeDelta = Math.min(delta, 250);
          const step = (safeDelta / DURATION_MS) * playbackSpeed;
          const next = (Number.isFinite(prev) ? prev : 0) + step;
          return next >= 1 ? 0 : next;
        });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  // Current active stage (0 to 5) with full fallback protection
  const safeProgress = Number.isFinite(progress) ? Math.max(0, Math.min(0.9999, progress)) : 0;
  const currentStageIndex = Math.max(0, Math.min(5, Math.floor(safeProgress * 6)));
  const activeStage = PHARMA_STAGES[currentStageIndex] ?? PHARMA_STAGES[0];

  // Jump to specific stage
  const jumpToStage = (stageIdx: number) => {
    setProgress(Math.max(0, Math.min(5, stageIdx)) / 6 + 0.01);
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Formatted timestamp
  const currentSeconds = (safeProgress * 16).toFixed(1);

  return (
    <div className="relative flex flex-col rounded-3xl border border-white/15 bg-gradient-to-b from-[#111420] via-[#0c0e16] to-[#090b11] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Top Header Video Status Bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-5 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            3D Manufacturing Line: <span className="text-cyan">{activeStage.name}</span>
          </span>
        </div>

        {/* Speed toggle & Time code */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-mono text-white/70">
            <span>{currentSeconds}s</span> / <span>16.0s</span>
          </div>
          <button
            type="button"
            onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))}
            className="rounded-md border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white/80 hover:bg-white/15 transition"
          >
            {playbackSpeed}x Speed
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full min-h-[380px] bg-radial from-[#1e293b]/30 via-transparent to-transparent">
        {mounted ? (
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 2.2, 5.2], fov: 42 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[4, 7, 4]} intensity={2.2} castShadow color="#ffffff" shadow-mapSize={[1024, 1024]} />
            <pointLight position={[-4, 3, 2]} intensity={1.4} color="#38bdf8" />
            <pointLight position={[3, -1, 3]} intensity={1.0} color="#f59e0b" />
            <Environment preset="city" environmentIntensity={0.65} />

            <Suspense fallback={null}>
              <ProductionScene progress={safeProgress} stage={currentStageIndex} />
            </Suspense>
          </Canvas>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
            <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-cyan border-t-transparent" />
            Initializing 3D Line...
          </div>
        )}

        {/* Floating Active Stage Badge on Canvas */}
        <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex flex-col gap-1 rounded-2xl border border-white/15 bg-black/75 p-3.5 backdrop-blur-xl shadow-xl max-w-[280px]">
          <div className="flex items-center gap-2">
            <activeStage.icon className="h-4 w-4" style={{ color: activeStage.color }} />
            <strong className="text-xs font-bold text-white">{activeStage.title}</strong>
          </div>
          <p className="line-clamp-2 text-[11px] leading-relaxed text-white/70">{activeStage.desc}</p>
        </div>

        {/* Orbit Hint badge on Canvas */}
        <div className="pointer-events-none absolute top-4 right-4 z-10 hidden sm:flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[10px] font-semibold text-white/70 backdrop-blur-md">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan" /> GMP Pharma Line
        </div>
      </div>

      {/* Interactive Stage Timeline Scrubber */}
      <div className="border-t border-white/10 bg-[#090b11] p-4 sm:p-5">
        {/* Progress Bar with Scrub cursor */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            setProgress(Math.max(0, Math.min(1, clickPos)));
          }}
          className="relative h-2 w-full cursor-pointer rounded-full bg-white/10 overflow-hidden group"
          title="Click to seek sequence"
        >
          <div
            className="h-full bg-gradient-to-r from-cyan via-magenta to-yellow transition-[width] duration-75"
            style={{ width: `${safeProgress * 100}%` }}
          />
        </div>

        {/* Video Control Buttons & Stage Selector Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {/* Play / Pause / Reset */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 rounded-full bg-cyan px-3.5 py-1.5 text-xs font-bold text-ink shadow-md hover:bg-cyan/90 transition active:scale-95"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isPlaying ? "Pause" : "Play Line"}
            </button>
            <button
              type="button"
              onClick={() => {
                setProgress(0);
                setIsPlaying(true);
              }}
              title="Restart 3D Animation"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/15 active:scale-95 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* 6 Stage Navigation Pills */}
          <div className="flex flex-wrap gap-1.5">
            {PHARMA_STAGES.map((st, idx) => {
              const isActive = idx === currentStageIndex;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => jumpToStage(idx)}
                  className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all ${
                    isActive
                      ? "border border-cyan bg-cyan/20 text-cyan shadow-[0_0_15px_rgba(56,189,248,0.3)] scale-105"
                      : "border border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white"
                  }`}
                >
                  <st.icon className="h-3 w-3" style={{ color: isActive ? "#38bdf8" : "inherit" }} />
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
