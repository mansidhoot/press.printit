import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Sparkles } from "@react-three/drei";
import { Bloom, DepthOfField, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { LIGHT_CONFIG } from "@/three/lights";
import { scrollSceneStore } from "@/three/scene";
import PrintingPress from "./PrintingPress";
import PackagingBox from "./PackagingBox";

interface PrintingSceneProps {
  mode: "hero" | "pharma";
  reducedMotion: boolean;
  highQuality: boolean;
}

export default function PrintingScene({ mode, reducedMotion, highQuality }: PrintingSceneProps) {
  const parallaxGroup = useRef<THREE.Group>(null);

  // Mouse parallax: the whole scene eases toward the cursor instead of
  // moving the camera directly, so framing never breaks.
  useFrame((_, delta) => {
    const g = parallaxGroup.current;
    if (!g) return;
    const targetY = reducedMotion ? 0 : scrollSceneStore.pointer.x * 0.35;
    const targetX = reducedMotion ? 0 : scrollSceneStore.pointer.y * -0.18;
    const damp = Math.min(1, delta * 2.5);
    g.rotation.y += (targetY - g.rotation.y) * damp;
    g.rotation.x += (targetX - g.rotation.x) * damp;
  });

  return (
    <>
      <ambientLight intensity={LIGHT_CONFIG.ambient.intensity} color={LIGHT_CONFIG.ambient.color} />
      <directionalLight
        position={LIGHT_CONFIG.key.position}
        intensity={LIGHT_CONFIG.key.intensity}
        color={LIGHT_CONFIG.key.color}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={LIGHT_CONFIG.rim.position} intensity={LIGHT_CONFIG.rim.intensity} color={LIGHT_CONFIG.rim.color} />
      <pointLight position={LIGHT_CONFIG.fill.position} intensity={LIGHT_CONFIG.fill.intensity} color={LIGHT_CONFIG.fill.color} />

      <Environment preset="city" environmentIntensity={0.78} />
      <fog attach="fog" args={["#080b10", 7, 13]} />

      <group ref={parallaxGroup}>
        {mode === "hero" ? <PrintingPress reducedMotion={reducedMotion} /> : <PackagingBox reducedMotion={reducedMotion} />}
      </group>

      <Sparkles count={highQuality ? 60 : 22} scale={[6, 4, 4]} size={2.2} speed={0.25} color="#f4efe2" opacity={0.32} />
      <Sparkles count={highQuality ? 22 : 8} scale={[4, 3, 3]} size={1.6} speed={0.4} color="#4fb8e0" opacity={0.4} />

      <ContactShadows position={[0, -1.25, 0]} opacity={0.52} blur={2.8} far={4} scale={9} frames={highQuality ? Infinity : 1} />

      {highQuality && !reducedMotion && (
        <EffectComposer multisampling={0}>
          <DepthOfField focusDistance={0.015} focalLength={0.04} bokehScale={3} height={480} />
          <Bloom intensity={0.48} luminanceThreshold={0.65} luminanceSmoothing={0.2} mipmapBlur />
          <Vignette eskil={false} offset={0.2} darkness={0.72} />
        </EffectComposer>
      )}
    </>
  );
}
