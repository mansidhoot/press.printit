import * as THREE from "three";
import { BRAND } from "./scene";

/** Uncoated paper stock: soft sheen, no metalness, slightly rough. */
export function createPaperMaterial(tint: THREE.Color = BRAND.paper) {
  return new THREE.MeshPhysicalMaterial({
    color: tint,
    roughness: 0.72,
    metalness: 0,
    sheen: 0.6,
    sheenRoughness: 0.8,
    sheenColor: new THREE.Color("#ffffff"),
    clearcoat: 0.05,
    clearcoatRoughness: 0.6,
  });
}

/**
 * A CMYK ink layer. Starts fully transparent — callers animate `.opacity`
 * each frame to reveal it, simulating ink transferring onto the sheet.
 */
export function createInkMaterial(color: THREE.Color) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.32,
    metalness: 0,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}

/** Foil / spot-UV finish: high metalness, low roughness, picks up the env map. */
export function createFoilMaterial(color: THREE.Color = BRAND.paper) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.85,
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.4,
  });
}

/** A thin glass / display-case pane, used sparingly as a premium accent. */
export function createGlassMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#ffffff"),
    transmission: 1,
    thickness: 0.4,
    roughness: 0.06,
    metalness: 0,
    ior: 1.4,
    envMapIntensity: 1.2,
    transparent: true,
  });
}
