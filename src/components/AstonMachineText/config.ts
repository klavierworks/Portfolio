export const astonMachineConfig = {
  picture: {
    // Device pixels per reference pixel, where the reference sets the text at glow.referenceFontSize
    maxDeviceScale: 1,
  },
  glow: {
    referenceFontSize: 97.25,
    edgeWidth: 0,
    edgeRounding: 3,
    blurAspect: 0.85,
    nearHaloRadius: 10,
    farHaloRadius: 7.5,
  },
  glowWebKit: {
    edgeRounding: 0,
  },
  pictureWebKit: {
    blurPixels: 0.5,
  },
  noise: {
    grainStrength: 0.032 * 0.45,
    grainCellSize: 8,
    unevennessStrength: 2 * 0.08 * 0.11,
    unevennessCellSize: 40,
  },
  motion: {
    frameMilliseconds: 40,
    weaveAmountX: 0.53 / 4,
    weaveAmountY: 0.71 / 4,
    weavePersistenceX: 0.8,
    weavePersistenceY: 0.64,
    flickerAmount: 0.004,
    flickerPersistence: 0.83,
    driftAmount: 0.35 * 0.75,
    driftFeatureSize: 450,
    driftCycleSeconds: 2,
  },
};

export type PictureConfig = typeof astonMachineConfig.picture;
export type GlowConfig = typeof astonMachineConfig.glow;
export type NoiseConfig = typeof astonMachineConfig.noise;
export type MotionConfig = typeof astonMachineConfig.motion;
