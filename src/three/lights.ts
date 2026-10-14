/**
 * Light rig config for the printing/packaging scenes. Kept as plain data
 * (rather than imperative THREE.Light factories) so PrintingScene can spread
 * these straight into R3F's declarative <ambientLight>/<directionalLight>
 * JSX — that's the idiomatic way to light an R3F scene.
 */
export const LIGHT_CONFIG = {
  ambient: { intensity: 0.5, color: "#ffffff" },
  /** Warm key light, casts the soft shadow. */
  key: {
    position: [4, 6, 5] as [number, number, number],
    intensity: 1.7,
    color: "#fff6ea",
  },
  /** Cyan rim light — traces the CMYK mood along one edge. */
  rim: {
    position: [-5, 2, -4] as [number, number, number],
    intensity: 1.2,
    color: "#4fb8e0",
  },
  /** Magenta fill from below-front, keeps shadows from going flat black. */
  fill: {
    position: [-3, -2, 4] as [number, number, number],
    intensity: 0.45,
    color: "#d1487e",
  },
};
